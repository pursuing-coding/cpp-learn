import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createInterface } from "node:readline";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

async function startWithCompiler(t, versionProbe) {
  const dir = await mkdtemp(join(tmpdir(), "cpp-learn-probe-"));
  let app, closed;
  t.after(async () => {
    app?.kill();
    await closed;
    await rm(dir, { recursive: true, force: true });
  });
  const compiler = join(dir, "test-c++");
  await writeFile(compiler, `#!/bin/sh
[ "$1" = "--version" ] || exit 2
${versionProbe}
printf '%s\\n' 'Test C++ compiler'
`, { mode: 0o700 });
  app = spawn(process.execPath, ["server.js"], {
    cwd: fileURLToPath(new URL("../", import.meta.url)),
    env: { ...process.env, PORT: "0", CXX: compiler, PATH: dir, PROBE_DIR: dir },
    stdio: ["ignore", "pipe", "inherit"]
  });
  closed = new Promise(resolve => app.once("close", resolve));
  const lines = createInterface({ input: app.stdout });
  const [line] = await once(lines, "line", { signal: AbortSignal.timeout(5_000) });
  const url = line.match(/http:\/\/127\.0\.0\.1:\d+$/)?.[0];
  assert.ok(url, line);

  return async (path, init) => {
    const response = await fetch(url + path, { ...init, signal: AbortSignal.timeout(10_000) });
    assert.equal(response.status, 200);
    return response.json();
  };
}

const posixOnly = { skip: process.platform === "win32" };

test("detects a cold compiler on the first probe even after two seconds", posixOnly, async t => {
  const request = await startWithCompiler(t, "/bin/sleep 3");
  const status = await request("/api/health");
  assert.equal(status.available, true, JSON.stringify(status));
  assert.equal(status.version, "Test C++ compiler");
});

test("reprobes after a transient compiler failure in the same server", posixOnly, async t => {
  const request = await startWithCompiler(t, `
if [ ! -f "$PROBE_DIR/attempted" ]; then
  : > "$PROBE_DIR/attempted"
  exit 1
fi`);
  const first = await request("/api/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code: 'int main() { std::cout << "preview"; }' })
  });
  assert.equal(first.status, "learning-preview");
  const recovered = await request("/api/health");
  assert.equal(recovered.available, true, JSON.stringify(recovered));
});
