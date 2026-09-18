import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import dns from 'node:dns'
import https from 'node:https'

// ─── DNS Bypasser for TMDB (Bypasses Indian ISP DNS Sinkhole on Jio/Airtel) ───
// In India, ISPs spoof DNS queries for api.themoviedb.org and image.tmdb.org to sinkhole IPs.
// We query Cloudflare (1.1.1.1) and Google (8.8.8.8) DNS directly to resolve the true IPs.
const resolver = new dns.Resolver()
resolver.setServers(['1.1.1.1', '8.8.8.8'])

const cachedIps = {}
function getIps(hostname) {
  return new Promise((resolve) => {
    if (cachedIps[hostname] && cachedIps[hostname].length) {
      return resolve(cachedIps[hostname])
    }
    resolver.resolve4(hostname, (err, addrs) => {
      if (!err && addrs && addrs.length) {
        cachedIps[hostname] = addrs
        resolve(addrs)
      } else {
        dns.resolve4(hostname, (e, fallback) => {
          cachedIps[hostname] = fallback || []
          resolve(cachedIps[hostname])
        })
      }
    })
  })
}

let rr = 0
function customLookup(hostname, options, callback) {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }
  getIps(hostname).then((ips) => {
    if (!ips || !ips.length) return dns.lookup(hostname, options, callback)
    if (options && options.all) {
      return callback(null, ips.map((a) => ({ address: a, family: 4 })))
    }
    const ip = ips[(rr++) % ips.length]
    callback(null, ip, 4)
  })
}

const tmdbAgent = new https.Agent({ lookup: customLookup, keepAlive: false })

function tmdbBypassPlugin() {
  return {
    name: 'tmdb-bypass-proxy',
    configureServer(server) {
      // 1. TMDB API proxy: /tmdb/3/... -> https://api.themoviedb.org/3/...
      server.middlewares.use('/tmdb', (req, res) => {
        const targetPath = req.url // connect middleware strips mount point '/tmdb'
        const headers = { ...req.headers }
        headers.host = 'api.themoviedb.org'

        const makeReq = (attempt = 0) => {
          const proxyReq = https.request(
            {
              hostname: 'api.themoviedb.org',
              port: 443,
              path: targetPath,
              method: req.method,
              headers,
              agent: tmdbAgent,
            },
            (proxyRes) => {
              res.writeHead(proxyRes.statusCode, proxyRes.headers)
              proxyRes.pipe(res)
            }
          )

          proxyReq.on('error', (err) => {
            if (attempt < 2 && (err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT')) {
              setTimeout(() => makeReq(attempt + 1), 200)
              return
            }
            if (!res.headersSent) {
              res.writeHead(502, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: err.message }))
            }
          })

          if (req.method === 'POST' || req.method === 'PUT') {
            req.pipe(proxyReq)
          } else {
            proxyReq.end()
          }
        }

        makeReq(0)
      })

      // 2. TMDB Images proxy: /tmdb-img/... -> https://image.tmdb.org/t/p/...
      server.middlewares.use('/tmdb-img', (req, res) => {
        const targetPath = '/t/p' + req.url
        const headers = { ...req.headers }
        headers.host = 'image.tmdb.org'

        const makeReq = (attempt = 0) => {
          const proxyReq = https.request(
            {
              hostname: 'image.tmdb.org',
              port: 443,
              path: targetPath,
              method: req.method,
              headers,
              agent: tmdbAgent,
            },
            (proxyRes) => {
              res.writeHead(proxyRes.statusCode, proxyRes.headers)
              proxyRes.pipe(res)
            }
          )

          proxyReq.on('error', (err) => {
            if (attempt < 2 && (err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT')) {
              setTimeout(() => makeReq(attempt + 1), 200)
              return
            }
            if (!res.headersSent) {
              res.writeHead(502)
              res.end()
            }
          })

          proxyReq.end()
        }

        makeReq(0)
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tmdbBypassPlugin(),
  ],
})
