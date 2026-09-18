// proxy-server.js
// Run this with: node proxy-server.js
// It listens on port 4000 and proxies all requests to api.themoviedb.org

import http from "http";
import https from "https";
import { URL } from "url";

const TMDB_BASE = "https://api.themoviedb.org";
const PORT = 4000;

const server = http.createServer((req, res) => {
  // CORS headers so browser can call localhost:4000
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, accept, Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const targetUrl = new URL(req.url, TMDB_BASE);
  console.log(`[proxy] ${req.method} ${targetUrl.href}`);

  const options = {
    hostname: targetUrl.hostname,
    path: targetUrl.pathname + targetUrl.search,
    method: req.method,
    headers: {
      ...req.headers,
      host: targetUrl.hostname,
    },
  };

  const proxyReq = https.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on("error", (err) => {
    console.error("[proxy] Error:", err.message);
    res.writeHead(502);
    res.end(JSON.stringify({ error: err.message }));
  });

  req.pipe(proxyReq, { end: true });
});

server.listen(PORT, () => {
  console.log(`✅ TMDB Proxy running at http://localhost:${PORT}`);
  console.log(`   Example: http://localhost:${PORT}/3/movie/now_playing?page=1`);
});
