import assert from "node:assert/strict";
import { suite, check } from "./safari.js";

const helloWorld =
  '#include <iostream>\n\n' +
  'int main() {\n' +
  '    std::cout << "Hello, C++ World!" << std::endl;\n' +
  "    return 0;\n" +
  "}\n";


async function hasHorizontalOverflow(page) {
  return page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
}

async function mockCppRunner(page, resolver) {
  page.mockRun(async payload => {
    const stdout = await resolver(payload);
    return {
        status: "success",
        stdout,
        stderr: "",
        durationMs: 6
      };
  });
}

suite(test => {
  test("locks lessons, unlocks the next lesson, and protects reset", async ({ page }) => {
    await mockCppRunner(page, () => "Hello, C++ World!\n");

    await check(() => page.title(), "cpp-learn");
    await check(() => page.locator(".brand strong").text(), "cpp-learn");
    await check(() => page.locator(".level-item").count(), 13);
    await check(() => page.locator(".level-item:disabled").count(), 12);
    await check(() => page.locator("#resetProgress").enabled(), false);

    await check(() => page.locator(".level-item").nth(2).attribute("title"), "完成前一章后解锁");
    await check(() => page.locator(".level-item").nth(2).attribute("aria-label"), /完成前一章后解锁/);

    await page.locator("#codeEditor").fill(helloWorld);
    await page.locator("#submitTask").click();

    await check(() => page.locator("#consoleOutput").text(), "[本章全部测试通过]", "contains");
    await check(() => page.locator("#consoleOutput").text(), "Unlocked: 2.", "contains");
    await check(() => page.locator("#progressText").text(), "1/13 章");
    await check(() => page.locator(".level-item:disabled").count(), 11);
    await check(() => page.locator(".level-item").nth(1).enabled(), true);
    await check(() => page.locator("#resetProgress").enabled(), true);
    await check(() => page.locator("#nextLesson").visible(), true);
    await check(() => page.locator("#nextLesson").enabled(), true);

    page.confirm( async (dialog) => {
      assert.deepEqual(await dialog.getText(), "确认重置学习进度？");
      await dialog.dismiss();
    });
    await page.locator("#resetProgress").click();
    await check(() => page.locator("#progressText").text(), "1/13 章");

    page.confirm( async (dialog) => {
      assert.deepEqual(await dialog.getText(), "确认重置学习进度？");
      await dialog.accept();
    });
    await page.locator("#resetProgress").click();
    await check(() => page.locator("#progressText").text(), "0/13 章");
    await check(() => page.locator(".level-item:disabled").count(), 12);
    await check(() => page.locator("#resetProgress").enabled(), false);
  });

  test("switches standard cases and restores expected stdin", async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem(
        "cpp-learn-progress-v2",
        JSON.stringify({
          completedLessons: 2,
          completedLessonIds: ["1", "2"],
          passedTestCaseIdsByLessonId: {}
        })
      );
    });
    await page.reload();

    await page.locator(".level-item").nth(2).click();
    await page.clickButton(/n = 5/);

    await check(() => page.locator("#stdinInput").value(), "5");
    await check(() => page.locator("#testSummary").text(), "0/3 通过");
    await check(() => page.evaluate(() => document.querySelector("#stdinInput").getBoundingClientRect().height >= 72), true);
  });

  test("runs every standard case and unlocks progress through submit", async ({ page }) => {
    const outputByInput = {
      "10": "55\n",
      "5": "15\n",
      "0": "0\n"
    };
    await mockCppRunner(page, (payload) => outputByInput[String(payload.stdin || "").trim()] || "");
    await page.evaluate(() => {
      localStorage.setItem(
        "cpp-learn-progress-v2",
        JSON.stringify({
          completedLessons: 2,
          completedLessonIds: ["1", "2"],
          passedTestCaseIdsByLessonId: {}
        })
      );
    });
    await page.reload();

    await page.locator(".level-item").nth(2).click();
    const answerCode = await page.evaluate(() => window.CPP_LESSONS[2].answerCode);
    await page.locator("#codeEditor").fill(answerCode);
    await page.locator("#submitTask").click();

    await check(() => page.locator("#consoleOutput").text(), "[全测完成: 本次 3/3 通过", "contains");
    await check(() => page.locator("#consoleOutput").text(), "Unlocked: 4.", "contains");
    await check(() => page.locator("#progressText").text(), "3/13 章");
    await check(async () =>
        page.evaluate(() => {
          const state = JSON.parse(localStorage.getItem("cpp-learn-progress-v2") || "{}");
          return {
            completedLessons: state.completedLessons,
            passedCount: state.passedTestCaseIdsByLessonId?.["3"]?.length || 0
          };
        })
      , { completedLessons: 3, passedCount: 3 });
  });

  test("saves code drafts while keeping stdin runtime-only", async ({ page }) => {
    await check(() => page.locator("#resetProgress").enabled(), false);

    await page.locator("#stdinInput").fill("Only runtime input");
    await check(() => page.locator("#resetProgress").enabled(), false);
    assert.equal(await page.evaluate(() => localStorage.getItem("cpp-learn-stdin-v2")), null);

    const draft = `${helloWorld}\n// draft line\n`;
    await page.locator("#codeEditor").fill(draft);
    await check(() => page.locator("#resetProgress").enabled(), true);

    await page.reload();
    await check(() => page.locator("#codeEditor").value(), draft);
    await check(() => page.locator("#stdinInput").value(), "");
    assert.equal(await page.evaluate(() => localStorage.getItem("cpp-learn-stdin-v2")), null);

    page.confirm( async (dialog) => {
      await dialog.accept();
    });
    await page.locator("#resetProgress").click();

    await check(() => page.locator("#codeEditor").value(), /TODO: 输出 Hello, C\+\+ World!/);
    await check(() => page.locator("#resetProgress").enabled(), false);
    assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem("cpp-learn-drafts-v2")).drafts), {});
  });

  test("sends standard input to the runner and supports focus mode", async ({ page }) => {
    const runRequests = [];
    await mockCppRunner(page, (payload) => {
      runRequests.push(payload);
      return `stdin:${payload.stdin}`;
    });

    await page.locator("#codeEditor").fill(helloWorld);
    await page.locator("#stdinInput").fill("Alice\n18");
    await page.locator("#runCode").click();

    await check(() => page.locator("#consoleOutput").text(), "stdin:Alice\n18", "contains");
    assert.deepEqual(runRequests.at(-1).stdin, "Alice\n18");

    await page.locator("#focusCode").click();
    await check(() => page.locator("#focusStdinInput").value(), "Alice\n18");
    await page.locator("#focusStdinInput").fill("Bob\n19");
    await page.locator("#focusRun").click();
    await check(() => page.locator("#focusOutput").text(), "stdin:Bob\n19", "contains");
    assert.deepEqual(runRequests.at(-1).stdin, "Bob\n19");
    await page.locator("#closeFocus").click();
    await check(() => page.locator("#stdinInput").value(), "Bob\n19");
  });

  test("core UI panels open without layout overflow", async ({ page }) => {
    await check(() => hasHorizontalOverflow(page), false);
    await check(() => page.evaluate(() => {
      const run = document.querySelector("#runCode").getBoundingClientRect();
      return run.width > 0 && run.right <= document.documentElement.clientWidth;
    }), true);

    const editorStylesMatch = (editorId, highlightId) => page.evaluate((editor, highlight) => {
      const textarea = getComputedStyle(document.getElementById(editor));
      const visible = getComputedStyle(document.getElementById(highlight));
      return ["fontFamily", "fontSize", "lineHeight", "padding", "whiteSpace"].every(key => textarea[key] === visible[key]);
    }, editorId, highlightId);
    await check(() => editorStylesMatch("codeEditor", "editorHighlight"), true);

    await page.locator("#showAnswer").click();
    await check(() => page.locator("#answerDrawer").attribute("class"), /is-open/);
    await check(() => hasHorizontalOverflow(page), false);
    await page.locator("#closeAnswer").click();
    await check(() => page.locator("#answerDrawer").attribute("class"), /is-open/, "notMatch");

    await page.locator("#focusCode").click();
    await check(() => page.locator("#focusModal").attribute("class"), /is-open/);
    await check(() => hasHorizontalOverflow(page), false);
    await check(() => editorStylesMatch("focusEditor", "focusHighlight"), true);
    await page.locator("#closeFocus").click();
    await check(() => page.locator("#focusModal").attribute("class"), /is-open/, "notMatch");
  });

  test("only the current submission can unlock the next lesson", async ({ page }) => {
    await page.evaluate(() => localStorage.setItem("cpp-learn-progress-v2", JSON.stringify({
      completedLessons: 0,
      passedTestCaseIdsByLessonId: { "1": ["default"] }
    })));
    await page.reload();
    await mockCppRunner(page, () => "wrong output\n");
    await page.locator("#submitTask").click();
    await check(() => page.locator("#consoleOutput").text(), "本次 0/1 通过", "contains");
    await check(() => page.locator("#progressText").text(), "0/13 章");
    await check(() => page.locator(".level-item").nth(1).enabled(), false);
  });

  test("ignores unfinished submissions after changing lesson", async ({ page }) => {
    await page.evaluate(() => localStorage.setItem("cpp-learn-progress-v2", JSON.stringify({ completedLessons: 1 })));
    await page.reload();

    let received = false;
    let finishRun;
    const result = new Promise(resolve => { finishRun = resolve; });
    await mockCppRunner(page, () => { received = true; return result; });
    try {
      await page.locator("#submitTask").click();
      await check(() => received, true);
      await page.locator(".level-item").nth(1).click();
      await check(() => page.locator("#submitTask").enabled(), true);
    } finally {
      finishRun("Hello, C++ World!\n");
    }
    await check(() => page.locator("#progressText").text(), "1/13 章");
    await check(() => page.locator("#lessonArticle h1").text(), /^2\. 变量、内存与类型系统/);
  });

  test("another tab can reset progress while a submission is running", async ({ page }) => {
    await page.evaluate(() => localStorage.setItem("cpp-learn-progress-v2", JSON.stringify({ completedLessons: 1 })));
    await page.reload();
    await page.locator("#codeEditor").fill(helloWorld);
    await page.evaluate(() => {
      const frame = document.createElement("iframe");
      frame.id = "resetTab";
      frame.hidden = true;
      frame.src = "./";
      document.body.append(frame);
    });
    await check(() => page.evaluate(() => {
      const doc = document.querySelector("#resetTab").contentDocument;
      return doc.querySelector(".level-item.is-active") !== null &&
        doc.querySelector("#progressText")?.textContent === "1/13 章" &&
        doc.querySelector("#resetProgress")?.disabled === false;
    }), true);

    let reply;
    await mockCppRunner(page, () => new Promise(resolve => { reply = resolve; }));
    try {
      await page.locator("#submitTask").click();
      await check(() => typeof reply, "function");
      const didReset = await page.evaluate(() => {
        const other = document.querySelector("#resetTab").contentWindow;
        other.confirm = () => true;
        other.document.querySelector("#resetProgress").click();
        return Boolean(other.localStorage.getItem("cpp-learn-reset-v3"));
      });
      assert.equal(didReset, true);
      reply("Hello, C++ World!\n");
      await check(() => page.locator("#progressText").text(), "0/13 章");
      await check(() => page.locator("#testSummary").text(), "0/1 通过");
      await page.reload();
      await check(() => page.locator("#codeEditor").value(), /TODO: 输出 Hello, C\+\+ World!/);
    } finally {
      reply?.("Hello, C++ World!\n");
    }
  });

  test("uses the local compiler when the runner is not mocked", async ({ page }) => {
    await page.locator("#codeEditor").fill(helloWorld);
    await page.locator("#runCode").click();
    await check(() => page.locator("#consoleOutput").text(), "[测试用例通过: 默认样例]", "contains", 15_000);
  });
});
