import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const hash = (value) => createHash("sha256").update(value).digest("hex");
const today = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(new Date());
const logPathFor = (date) => "docs/worklog/" + date.slice(2, 4) + date.slice(5, 7) + "/" + date + ".md";
const writeOutput = (value) => process.stdout.write(JSON.stringify(value) + "\n");

export function completionIssues(before, after, logPath, logText) {
  const changed = [...new Set([...Object.keys(before), ...Object.keys(after)])]
    .filter((name) => before[name] !== after[name]);
  const work = changed.filter((name) => !name.startsWith("docs/worklog/"));
  if (!work.length) return [];
  const logUpdated = changed.includes(logPath) && Boolean(logText.trim());
  return logUpdated ? [] : ["이번 작업의 이유·결정·검증을 " + logPath + "에 기록하지 않았습니다."];
}

async function snapshot() {
  const names = execFileSync("git", ["ls-files", "-z", "--cached", "--others", "--exclude-standard"], {
    cwd: root, encoding: "utf8", timeout: 10000, windowsHide: true,
  }).split("\0").filter(Boolean);
  const result = {};
  for (const name of new Set(names)) {
    if (name.startsWith(".local/") || /(^|\/)\.env(?:\.|$)/.test(name)) continue;
    try { result[name] = hash(await readFile(path.join(root, name))); }
    catch (error) { if (error.code !== "ENOENT" && error.code !== "EISDIR") throw error; }
  }
  return result;
}

async function readMaybe(file) {
  try { return await readFile(file, "utf8"); }
  catch (error) { if (error.code === "ENOENT") return ""; throw error; }
}

async function main() {
  let raw = "";
  for await (const chunk of process.stdin) raw += chunk;
  const event = JSON.parse(raw || "{}");
  const eventName = event.hook_event_name;
  if (!["UserPromptSubmit", "Stop"].includes(eventName)) return writeOutput({});
  const actualRoot = execFileSync("git", ["rev-parse", "--show-toplevel"], {
    cwd: event.cwd || root, encoding: "utf8", timeout: 5000, windowsHide: true,
  }).trim();
  if (path.resolve(actualRoot).toLowerCase() !== root.toLowerCase()) return writeOutput({});

  const agents = await readFile(path.join(root, "AGENTS.md"), "utf8");
  const policy = agents.match(/<!-- BEGIN:worklog-completion -->([\s\S]*?)<!-- END:worklog-completion -->/)?.[1].trim();
  if (!policy) throw new Error("AGENTS.md completion policy block not found");
  const stateDir = path.join(root, ".local", "codex-hook-state");
  const key = hash(String(event.session_id || "unknown") + ":" + String(event.turn_id || "current"));
  const statePath = path.join(stateDir, key + ".json");

  if (eventName === "UserPromptSubmit") {
    await mkdir(stateDir, { recursive: true });
    await writeFile(statePath, JSON.stringify({ files: await snapshot() }), "utf8");
    return writeOutput({ hookSpecificOutput: {
      hookEventName: "UserPromptSubmit",
      additionalContext: "이 저장소의 AGENTS.md 완료 기준을 적용하세요.\n" + policy,
    } });
  }

  const saved = await readMaybe(statePath);
  if (!saved) return writeOutput({
    systemMessage: "작업 로그 훅의 턴 시작 기록이 없습니다. AGENTS.md 완료 기준을 직접 확인하세요. 다음 사용자 요청부터 변경 비교가 적용됩니다.",
  });
  const before = JSON.parse(saved).files;
  const after = await snapshot();
  const logPath = logPathFor(today());
  const logText = await readMaybe(path.join(root, logPath));
  const issues = completionIssues(before, after, logPath, logText);
  if (!issues.length) return writeOutput({});
  return writeOutput({ systemMessage:
    "참고용 저장소 변경 감지입니다. 단순 질문·설명·조언·상태 확인이면 무시하세요. " +
    "다른 세션의 변경을 이번 요청의 작업으로 간주하지 마세요. " +
    "이번 요청에서 직접 수행한 의미 있는 구현·설정 변경 또는 확정한 기획 결정이 있을 때만 로그를 확인하세요.\n" +
    issues.join("\n") });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    writeOutput({ systemMessage: "작업 로그 훅 실행 실패: " + error.message + ". AGENTS.md 완료 기준을 직접 확인하세요." });
    process.exitCode = 1;
  });
}
