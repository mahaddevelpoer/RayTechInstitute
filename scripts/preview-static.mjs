// Local production preview with the same security policy as Firebase Hosting.
import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
const root = path.resolve("out");
const previewPort = Number(process.env.PORT || 4173);
if (!Number.isInteger(previewPort) || previewPort < 1024 || previewPort > 65535) throw new Error('Choose a valid unprivileged preview PORT.');
const config = JSON.parse(await fs.readFile("firebase.json", "utf8"));
function headersFor(route) {
  return Object.assign({}, ...config.hosting.headers
    .filter(rule => rule.source && path.posix.matchesGlob(route, rule.source))
    .map(rule => Object.fromEntries(rule.headers.map(header => [header.key, header.value]))));
}
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".wasm": "application/wasm",
  ".zip": "application/zip",
};
http
  .createServer(async (req, res) => {
    try {
      const route = decodeURIComponent(
        new URL(req.url, "http://127.0.0.1").pathname,
      );
      let file = path.resolve(root, "." + route);
      if (!file.startsWith(root + path.sep) && file !== root) {
        res.writeHead(403).end();
        return;
      }
      if (!path.extname(file)) file = path.join(file, "index.html");
      const data = await fs.readFile(file);
      res.writeHead(200, {
        ...headersFor(route),
        "Content-Type": mime[path.extname(file)] || "application/octet-stream",
        "Cache-Control": "no-store",
      });
      res.end(data);
    } catch {
      res
        .writeHead(404, { "Content-Type": "text/plain" })
        .end("Page not found");
    }
  })
  .listen(previewPort, "127.0.0.1", () =>
    console.log(`Production preview: http://127.0.0.1:${previewPort}`),
  );
