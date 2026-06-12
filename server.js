import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, isAbsolute, join, relative, resolve } from "node:path";
import { tmpdir } from "node:os";

const port = Number(process.env.PORT || 4173);
const publicDir = resolve("public");
const maxCodeLength = 30_000;
const maxOutputLength = 20_000;
const compileTimeoutMs = 8_000;
const runTimeoutMs = 5_000;

const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml; charset=utf-8"],
  [".png", "image/png"],
  [".ico", "image/x-icon"]
]);

let compilerStatusPromise;

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(payload));
}

function sendText(response, statusCode, text, contentType = "text/plain; charset=utf-8") {
  response.writeHead(statusCode, {
    "Content-Type": contentType,
    "Cache-Control": "no-store"
  });
  response.end(text);
}

function readBody(request) {
  return new Promise((resolveBody, rejectBody) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 96_000) {
        request.destroy();
        rejectBody(new Error("Request body is too large."));
      }
    });
    request.on("end", () => resolveBody(body));
    request.on("error", rejectBody);
  });
}

function runCommand(command, args, options = {}) {
  return new Promise((resolveRun) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      shell: false,
      windowsHide: true,
      stdio: ["pipe", "pipe", "pipe"]
    });

    let stdout = "";
    let stderr = "";
    let didTimeOut = false;
    const timer = setTimeout(() => {
      didTimeOut = true;
      child.kill("SIGKILL");
    }, options.timeoutMs || runTimeoutMs);

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
      if (stdout.length > maxOutputLength) child.kill("SIGKILL");
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
      if (stderr.length > maxOutputLength) child.kill("SIGKILL");
    });
    child.on("error", (error) => {
      clearTimeout(timer);
      resolveRun({ ok: false, missingCommand: error.code === "ENOENT", error, stdout, stderr });
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      resolveRun({
        ok: code === 0 && !didTimeOut,
        code,
        didTimeOut,
        stdout: stdout.slice(0, maxOutputLength),
        stderr: stderr.slice(0, maxOutputLength)
      });
    });

    if (options.stdin) child.stdin.write(options.stdin);
    child.stdin.end();
  });
}

function uniqueCompilerCandidates() {
  const candidates = [process.env.CXX, "g++", "clang++"].filter(Boolean);
  return Array.from(new Set(candidates));
}

async function getCompilerStatus() {
  if (!compilerStatusPromise) {
    compilerStatusPromise = (async () => {
      for (const command of uniqueCompilerCandidates()) {
        const result = await runCommand(command, ["--version"], { timeoutMs: 2_000 });
        if (result.ok) {
          return {
            available: true,
            command,
            version: [result.stdout, result.stderr].filter(Boolean).join("\n").trim().split("\n")[0],
            message: `本地 C++ 编译器可用：${command}`
          };
        }
      }

      return {
        available: false,
        demoMode: true,
        message: "未找到 g++ 或 clang++，已启用有限教学预览。"
      };
    })();
  }

  return compilerStatusPromise;
}

function decodeCString(value) {
  return value
    .replaceAll('\\"', '"')
    .replaceAll("\\n", "\n")
    .replaceAll("\\t", "\t")
    .replaceAll("\\r", "\r")
    .replaceAll("\\\\", "\\");
}

function splitStreamParts(expression) {
  const parts = [];
  let current = "";
  let quote = "";
  let escaping = false;

  for (let index = 0; index < expression.length; index += 1) {
    const char = expression[index];
    const next = expression[index + 1];

    if (escaping) {
      current += char;
      escaping = false;
      continue;
    }

    if (char === "\\") {
      current += char;
      escaping = true;
      continue;
    }

    if ((char === '"' || char === "'") && !quote) {
      quote = char;
      current += char;
      continue;
    }

    if (char === quote) {
      quote = "";
      current += char;
      continue;
    }

    if (char === "<" && next === "<" && !quote) {
      parts.push(current.trim());
      current = "";
      index += 1;
      continue;
    }

    current += char;
  }

  parts.push(current.trim());
  return parts.filter(Boolean);
}

function buildPreviewVariables(code) {
  const variables = new Map();
  const assignmentPattern =
    /\b(?:std::string|string|int|long|double|float|bool|char)\s+([A-Za-z_]\w*)\s*=\s*([^;]+);/g;
  let match;

  while ((match = assignmentPattern.exec(code)) !== null) {
    const [, name, rawValue] = match;
    const value = rawValue.trim();

    if (/^"(?:\\.|[^"\\])*"$/.test(value)) {
      variables.set(name, decodeCString(value.slice(1, -1)));
    } else if (/^'(?:\\.|[^'\\])'$/.test(value)) {
      variables.set(name, decodeCString(value.slice(1, -1)));
    } else if (/^(true|false)$/.test(value)) {
      variables.set(name, value);
    } else if (/^-?\d+(?:\.\d+)?[fFlLuU]*$/.test(value)) {
      variables.set(name, value.replace(/[fFlLuU]+$/, ""));
    }
  }

  return variables;
}

function evaluateStreamExpression(expression, variables) {
  const output = [];

  for (const rawPart of splitStreamParts(expression)) {
    const part = rawPart.trim();
    if (!part || part === "std::flush") continue;
    if (part === "std::endl") {
      output.push("\n");
    } else if (part === "'\\n'" || part === '"\\n"') {
      output.push("\n");
    } else if (/^"(?:\\.|[^"\\])*"$/.test(part)) {
      output.push(decodeCString(part.slice(1, -1)));
    } else if (/^'(?:\\.|[^'\\])'$/.test(part)) {
      output.push(decodeCString(part.slice(1, -1)));
    } else if (variables.has(part)) {
      output.push(variables.get(part));
    } else if (/^-?\d+(?:\.\d+)?[fFlLuU]*$/.test(part) || /^(true|false)$/.test(part)) {
      output.push(part.replace(/[fFlLuU]+$/, ""));
    } else {
      return null;
    }
  }

  return output.join("");
}

function runTeachingPreview(code) {
  const variables = buildPreviewVariables(code);
  const coutPattern = /\bstd::cout\s*<<([\s\S]*?);/g;
  const outputParts = [];
  let match;

  while ((match = coutPattern.exec(code)) !== null) {
    const output = evaluateStreamExpression(match[1], variables);
    if (output !== null) outputParts.push(output);
  }

  if (outputParts.length > 0) {
    return {
      status: "learning-preview",
      stdout: outputParts.join(""),
      stderr: "Teaching preview: local C++ compiler unavailable.",
      durationMs: 0
    };
  }

  return {
    status: "preview-limited",
    stdout: "",
    stderr: 'Teaching preview: supports simple std::cout << "text" statements.',
    durationMs: 0
  };
}

async function handleRun(request, response) {
  let payload;
  try {
    payload = JSON.parse(await readBody(request));
  } catch {
    sendJson(response, 400, { status: "error", stdout: "", stderr: "请求格式不是有效的 JSON。", durationMs: 0 });
    return;
  }

  const code = String(payload.code || "");
  const stdin = String(payload.stdin || "");

  if (!code.trim()) {
    sendJson(response, 400, { status: "error", stdout: "", stderr: "No code submitted.", durationMs: 0 });
    return;
  }
  if (code.length > maxCodeLength) {
    sendJson(response, 400, {
      status: "error",
      stdout: "",
      stderr: `Code exceeds the ${maxCodeLength} character limit.`,
      durationMs: 0
    });
    return;
  }

  const compiler = await getCompilerStatus();
  if (!compiler.available) {
    sendJson(response, 200, runTeachingPreview(code));
    return;
  }

  const workDir = join(tmpdir(), `cpp-learn-${randomUUID()}`);
  const sourceFile = join(workDir, "main.cpp");
  const executableFile = join(workDir, process.platform === "win32" ? "main.exe" : "main");
  const startTime = Date.now();

  try {
    await mkdir(workDir, { recursive: true });
    await writeFile(sourceFile, code, "utf8");

    const compile = await runCommand(
      compiler.command,
      ["-std=c++17", "-O2", sourceFile, "-o", executableFile],
      { cwd: workDir, timeoutMs: compileTimeoutMs }
    );

    if (!compile.ok) {
      sendJson(response, 200, {
        status: compile.didTimeOut ? "compile-timeout" : "compile-error",
        stdout: "",
        stderr: compile.didTimeOut
          ? `${compile.stderr}\n编译超过 ${compileTimeoutMs / 1000} 秒，已停止。`
          : compile.stderr || compile.stdout || "Compilation failed.",
        durationMs: Date.now() - startTime
      });
      return;
    }

    const result = await runCommand(executableFile, [], {
      cwd: workDir,
      stdin,
      timeoutMs: runTimeoutMs
    });

    sendJson(response, 200, {
      status: result.didTimeOut ? "timeout" : result.ok ? "success" : "runtime-error",
      stdout: result.stdout,
      stderr: result.didTimeOut
        ? `${result.stderr}\n程序运行超过 ${runTimeoutMs / 1000} 秒，已停止。`
        : result.stderr,
      exitCode: result.code,
      durationMs: Date.now() - startTime
    });
  } catch (error) {
    sendJson(response, 500, {
      status: "server-error",
      stdout: "",
      stderr: `运行服务出错：${error.message}`,
      durationMs: Date.now() - startTime
    });
  } finally {
    await rm(workDir, { recursive: true, force: true });
  }
}

async function serveStatic(request, response) {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);
  let rawPath;
  try {
    rawPath = decodeURIComponent(requestUrl.pathname === "/" ? "/index.html" : requestUrl.pathname);
  } catch {
    sendText(response, 400, "Bad request");
    return;
  }

  const filePath = resolve(publicDir, rawPath.replace(/^\/+/, ""));
  const relativePath = relative(publicDir, filePath);
  const isInsidePublicDir =
    relativePath && !relativePath.startsWith("..") && !isAbsolute(relativePath);

  if (!isInsidePublicDir || !existsSync(filePath)) {
    sendText(response, 404, "Not found");
    return;
  }

  try {
    const content = await readFile(filePath);
    const contentType = mimeTypes.get(extname(filePath)) || "application/octet-stream";
    response.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": "no-cache"
    });
    response.end(content);
  } catch {
    sendText(response, 500, "Unable to read file.");
  }
}

const server = createServer(async (request, response) => {
  try {
    if (request.method === "GET" && request.url?.startsWith("/api/health")) {
      sendJson(response, 200, await getCompilerStatus());
      return;
    }
    if (request.method === "POST" && request.url?.startsWith("/api/run")) {
      await handleRun(request, response);
      return;
    }
    if (request.method === "GET") {
      await serveStatic(request, response);
      return;
    }
    sendText(response, 405, "Method not allowed");
  } catch {
    sendText(response, 500, "Internal server error");
  }
});

server.listen(port, () => {
  console.log(`cpp-learn is running at http://localhost:${port}`);
});
