// 작업 로그 모아보기 서버. 의존성 없음: `npm run worklog` → http://localhost:4600
// docs/worklog 아래 모든 .md를 요청 때마다 다시 훑으므로 새 파일은 새로고침만 하면 보인다.
import { createServer } from "node:http";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const port = Number(process.env.PORT) || 4600;
const mimeTypes = new Map([
  [".gif", "image/gif"], [".jpeg", "image/jpeg"], [".jpg", "image/jpeg"],
  [".json", "application/json"], [".png", "image/png"], [".txt", "text/plain"],
  [".webp", "image/webp"],
]);

function resolveInsideRoot(requested) {
  const target = path.resolve(root, requested || "");
  const relative = path.relative(root, target);
  if (!relative || relative === ".." || relative.startsWith(".." + path.sep) || path.isAbsolute(relative)) return null;
  return target;
}

async function walk(dir, base = "") {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name === "page") continue;
    const rel = base ? base + "/" + entry.name : entry.name;
    if (entry.isDirectory()) out.push(...(await walk(path.join(dir, entry.name), rel)));
    else if (entry.name.endsWith(".md")) out.push(rel);
  }
  return out;
}

const send = (res, code, type, body) => {
  res.writeHead(code, { "content-type": type + "; charset=utf-8", "cache-control": "no-store" });
  res.end(body);
};

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    if (url.pathname === "/api/list") {
      const files = [];
      for (const rel of await walk(root)) {
        const info = await stat(path.join(root, rel));
        files.push({ path: rel, mtime: info.mtimeMs });
      }
      return send(res, 200, "application/json", JSON.stringify(files));
    }
    if (url.pathname === "/api/file") {
      const target = resolveInsideRoot(url.searchParams.get("path"));
      if (!target || path.extname(target).toLowerCase() !== ".md") return send(res, 400, "text/plain", "bad path");
      return send(res, 200, "text/plain", await readFile(target, "utf8"));
    }
    if (url.pathname === "/api/asset") {
      const target = resolveInsideRoot(url.searchParams.get("path"));
      const type = target ? mimeTypes.get(path.extname(target).toLowerCase()) : null;
      if (!target || !type) return send(res, 400, "text/plain", "bad path");
      res.writeHead(200, { "content-type": type, "cache-control": "no-store", "x-content-type-options": "nosniff" });
      return res.end(await readFile(target));
    }
    if (url.pathname === "/" || url.pathname === "/index.html") {
      return send(res, 200, "text/html", await readFile(path.join(here, "index.html"), "utf8"));
    }
    send(res, 404, "text/plain", "not found");
  } catch (error) {
    send(res, 500, "text/plain", String(error.message || error));
  }
}).listen(port, "127.0.0.1", () => console.log("작업 로그 페이지: http://localhost:" + port));
