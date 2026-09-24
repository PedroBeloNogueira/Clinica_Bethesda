const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
http
  .createServer((req, res) => {
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    } catch {
      res.writeHead(400).end();
      return;
    }
    const file = path.resolve(root, "." + pathname + (pathname.endsWith("/") ? "index.html" : ""));
    if (!file.startsWith(root + path.sep)) {
      res.writeHead(403).end();
      return;
    }
    fs.readFile(file, (error, body) => {
      if (error) {
        res
          .writeHead(404, { "Content-Type": "text/plain; charset=utf-8" })
          .end("Página não encontrada");
        return;
      }
      res.writeHead(200, {
        "Content-Type":
          {
            ".html": "text/html; charset=utf-8",
            ".css": "text/css; charset=utf-8",
            ".js": "text/javascript; charset=utf-8",
            ".svg": "image/svg+xml",
          }[path.extname(file)] || "application/octet-stream",
      });
      res.end(body);
    });
  })
  .listen(4173, "127.0.0.1", () => console.log("Site disponível em http://127.0.0.1:4173"));
