const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const HOST = "127.0.0.1";
const PORT = Number(process.env.PORT || 4173);
const ROOT = __dirname;

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

const server = http.createServer((request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);
  let filePath = decodeURIComponent(requestUrl.pathname);

  if (filePath === "/") {
    filePath = "/index.html";
  }

  const resolvedPath = path.join(ROOT, filePath);
  if (!resolvedPath.startsWith(ROOT)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(resolvedPath, (error, content) => {
    if (error) {
      response.writeHead(error.code === "ENOENT" ? 404 : 500, {
        "Content-Type": "text/plain; charset=utf-8",
      });
      response.end(error.code === "ENOENT" ? "Not found" : "Internal server error");
      return;
    }

    response.writeHead(200, {
      "Content-Type": MIME_TYPES[path.extname(resolvedPath).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-cache",
    });
    response.end(content);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`RAD-C28 disponible en http://${HOST}:${PORT}`);
});
