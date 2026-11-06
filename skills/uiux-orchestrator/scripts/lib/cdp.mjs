// Zero-dependency Chrome DevTools Protocol client for uiux-orchestrator scripts.
// Node 18+ (no global WebSocket needed: a minimal RFC 6455 client is implemented below).
import { spawn } from 'node:child_process'
import crypto from 'node:crypto'
import { EventEmitter } from 'node:events'
import fs from 'node:fs'
import http from 'node:http'
import os from 'node:os'
import path from 'node:path'

// ---------- Chrome discovery ----------
export function findChrome() {
  const env = process.env.CHROME_PATH
  if (env && fs.existsSync(env)) return env
  const candidates = []
  if (process.platform === 'darwin') {
    candidates.push(
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
      '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
      '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
    )
  } else if (process.platform === 'win32') {
    for (const base of [process.env.PROGRAMFILES, process.env['PROGRAMFILES(X86)'], process.env.LOCALAPPDATA]) {
      if (!base) continue
      candidates.push(
        path.join(base, 'Google/Chrome/Application/chrome.exe'),
        path.join(base, 'Microsoft/Edge/Application/msedge.exe'),
        path.join(base, 'Chromium/Application/chrome.exe'),
      )
    }
  } else {
    const names = ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser', 'microsoft-edge']
    for (const dir of (process.env.PATH || '').split(path.delimiter)) {
      for (const n of names) candidates.push(path.join(dir, n))
    }
  }
  return candidates.find((c) => fs.existsSync(c)) || null
}

// ---------- minimal WebSocket client ----------
class MiniWebSocket extends EventEmitter {
  constructor(socket, head) {
    super()
    this.socket = socket
    this.buf = Buffer.alloc(0)
    this.frags = []
    socket.on('data', (d) => this.#onData(d))
    socket.on('close', () => this.emit('close'))
    socket.on('error', (e) => this.emit('error', e))
    if (head && head.length) this.#onData(head)
  }

  #onData(chunk) {
    this.buf = this.buf.length ? Buffer.concat([this.buf, chunk]) : chunk
    for (;;) {
      if (this.buf.length < 2) return
      const b0 = this.buf[0]
      const b1 = this.buf[1]
      const fin = (b0 & 0x80) !== 0
      const op = b0 & 0x0f
      let len = b1 & 0x7f
      let off = 2
      if (len === 126) {
        if (this.buf.length < 4) return
        len = this.buf.readUInt16BE(2)
        off = 4
      } else if (len === 127) {
        if (this.buf.length < 10) return
        len = Number(this.buf.readBigUInt64BE(2))
        off = 10
      }
      const masked = (b1 & 0x80) !== 0
      let mask = null
      if (masked) {
        if (this.buf.length < off + 4) return
        mask = this.buf.subarray(off, off + 4)
        off += 4
      }
      if (this.buf.length < off + len) return
      let payload = this.buf.subarray(off, off + len)
      if (mask) {
        payload = Buffer.from(payload)
        for (let i = 0; i < payload.length; i++) payload[i] ^= mask[i % 4]
      }
      this.buf = this.buf.subarray(off + len)
      if (op === 0x8) { this.socket.end(); return }
      if (op === 0x9) { this.#write(0xa, payload); continue }
      if (op === 0xa) continue
      this.frags.push(Buffer.from(payload))
      if (fin) {
        const msg = Buffer.concat(this.frags).toString('utf8')
        this.frags = []
        this.emit('message', msg)
      }
    }
  }

  #write(op, payload) {
    const len = payload.length
    let header
    if (len < 126) {
      header = Buffer.alloc(2)
      header[1] = 0x80 | len
    } else if (len < 65536) {
      header = Buffer.alloc(4)
      header[1] = 0x80 | 126
      header.writeUInt16BE(len, 2)
    } else {
      header = Buffer.alloc(10)
      header[1] = 0x80 | 127
      header.writeBigUInt64BE(BigInt(len), 2)
    }
    header[0] = 0x80 | op
    const mask = crypto.randomBytes(4)
    const body = Buffer.alloc(len)
    for (let i = 0; i < len; i++) body[i] = payload[i] ^ mask[i % 4]
    this.socket.write(Buffer.concat([header, mask, body]))
  }

  send(text) { this.#write(0x1, Buffer.from(text, 'utf8')) }

  close() {
    try { this.#write(0x8, Buffer.alloc(0)) } catch { /* already closed */ }
    this.socket.end()
  }
}

function wsConnect(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url)
    const req = http.request({
      host: u.hostname,
      port: u.port,
      path: u.pathname + u.search,
      headers: {
        Connection: 'Upgrade',
        Upgrade: 'websocket',
        'Sec-WebSocket-Version': '13',
        'Sec-WebSocket-Key': crypto.randomBytes(16).toString('base64'),
      },
    })
    req.on('upgrade', (_res, socket, head) => resolve(new MiniWebSocket(socket, head)))
    req.on('response', (res) => reject(new Error(`WebSocket upgrade refused: HTTP ${res.statusCode}`)))
    req.on('error', reject)
    req.end()
  })
}

// ---------- CDP ----------
class Browser {
  constructor(ws) {
    this.ws = ws
    this.nextId = 0
    this.pending = new Map()
    this.listeners = new Set()
    const failAll = (why) => {
      for (const { reject, method, timer } of this.pending.values()) { clearTimeout(timer); reject(new Error(`${method}: ${why}`)) }
      this.pending.clear()
    }
    ws.on('close', () => failAll('connection to Chrome closed'))
    ws.on('error', (e) => failAll(`connection error: ${e.message}`))
    ws.on('message', (raw) => {
      const msg = JSON.parse(raw)
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject, method, timer } = this.pending.get(msg.id)
        clearTimeout(timer)
        this.pending.delete(msg.id)
        if (msg.error) reject(new Error(`${method}: ${msg.error.message}`))
        else resolve(msg.result)
      } else if (msg.method) {
        for (const l of this.listeners) l(msg)
      }
    })
  }

  send(method, params = {}, sessionId, timeoutMs = 30000) {
    const id = ++this.nextId
    const payload = { id, method, params }
    if (sessionId) payload.sessionId = sessionId
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => { this.pending.delete(id); reject(new Error(`${method}: no response in ${timeoutMs} ms`)) }, timeoutMs)
      this.pending.set(id, { resolve, reject, method, timer })
      try { this.ws.send(JSON.stringify(payload)) } catch (e) { clearTimeout(timer); this.pending.delete(id); reject(e) }
    })
  }

  async newPage() {
    const { targetId } = await this.send('Target.createTarget', { url: 'about:blank' })
    const { sessionId } = await this.send('Target.attachToTarget', { targetId, flatten: true })
    const browser = this
    const page = {
      send: (method, params) => browser.send(method, params, sessionId),
      on(method, fn) {
        const l = (msg) => { if (msg.sessionId === sessionId && msg.method === method) fn(msg.params) }
        browser.listeners.add(l)
        return () => browser.listeners.delete(l)
      },
      waitFor(method, timeoutMs = 15000) {
        return new Promise((resolve) => {
          const off = page.on(method, (p) => { off(); clearTimeout(t); resolve(p) })
          const t = setTimeout(() => { off(); resolve(null) }, timeoutMs)
        })
      },
      async evaluate(expression) {
        const r = await page.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })
        if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text)
        return r.result.value
      },
      async goto(url, settleMs = 400) {
        const loaded = page.waitFor('Page.loadEventFired', 20000)
        const nav = await page.send('Page.navigate', { url })
        if (nav.errorText) throw new Error(`Could not load ${url}: ${nav.errorText} (is the dev server running?)`)
        if ((await loaded) === null) throw new Error(`Timed out waiting for ${url} to load`)
        await page.assertLoaded(url)
        await page.evaluate('document.fonts ? document.fonts.ready.then(() => true) : true')
        await new Promise((r) => setTimeout(r, settleMs))
      },
      async assertLoaded(url) {
        const info = await page.evaluate(`({ href: location.href, status: (performance.getEntriesByType('navigation')[0] || {}).responseStatus || 0 })`)
        if (info.href.startsWith('chrome-error://')) throw new Error(`Could not load ${url} (browser error page)`)
        if (info.status >= 400) throw new Error(`${url} returned HTTP ${info.status}`)
      },
      async reload(settleMs = 400) {
        const loaded = page.waitFor('Page.loadEventFired', 20000)
        await page.send('Page.reload', { ignoreCache: true })
        if ((await loaded) === null) throw new Error('Timed out waiting for reload')
        await page.evaluate('document.fonts ? document.fonts.ready.then(() => true) : true')
        await new Promise((r) => setTimeout(r, settleMs))
      },
      close: () => browser.send('Target.closeTarget', { targetId }),
    }
    await page.send('Page.enable')
    await page.send('Runtime.enable')
    await page.send('Log.enable')
    return page
  }
}

export async function launchBrowser() {
  const bin = findChrome()
  if (!bin) {
    throw new Error('No Chrome, Chromium or Edge found. Set CHROME_PATH to the browser binary.')
  }
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'uiux-chrome-'))
  const flags = ['--headless', '--remote-debugging-port=0', `--user-data-dir=${profile}`,
    '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', '--mute-audio']
  // Chrome refuses to run as root without --no-sandbox (containers, some CI and cloud agents).
  if (typeof process.getuid === 'function' && process.getuid() === 0) flags.push('--no-sandbox')
  const proc = spawn(bin, [...flags, 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] })
  let cleaned = false
  const removeProfile = () => {
    try { fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }) } catch { /* best effort */ }
  }
  // Synchronous variant for exit/signal paths.
  const cleanup = () => {
    if (cleaned) return
    cleaned = true
    try { proc.kill('SIGKILL') } catch { /* already gone */ }
    removeProfile()
  }
  // Graceful variant: wait for Chrome to exit (it writes to the profile until then), then remove it.
  const cleanupAsync = async () => {
    if (cleaned) return
    cleaned = true
    if (proc.exitCode === null && proc.signalCode === null) {
      const exited = new Promise((r) => proc.once('exit', r))
      try { proc.kill() } catch { /* already gone */ }
      await Promise.race([exited, new Promise((r) => setTimeout(r, 3000))])
      if (proc.exitCode === null && proc.signalCode === null) { try { proc.kill('SIGKILL') } catch { /* gone */ } }
    }
    removeProfile()
  }
  const onSignal = (sig) => { cleanup(); process.exit(sig === 'SIGINT' ? 130 : 143) }
  process.once('SIGINT', onSignal)
  process.once('SIGTERM', onSignal)
  process.once('exit', cleanup)
  const wsUrl = await new Promise((resolve, reject) => {
    let err = ''
    const t = setTimeout(() => reject(new Error(`Chrome did not start in 20 s.\n${err}`)), 20000)
    proc.stderr.on('data', (d) => {
      err += d
      const m = err.match(/DevTools listening on (ws:\/\/\S+)/)
      if (m) { clearTimeout(t); resolve(m[1]) }
    })
    proc.on('exit', (code) => { clearTimeout(t); reject(new Error(`Chrome exited (${code}).\n${err}`)) })
  }).catch((e) => { cleanup(); throw e })
  let ws
  try { ws = await wsConnect(wsUrl) } catch (e) { cleanup(); throw e }
  ws.on('error', () => { /* handled by Browser; prevents an unhandled 'error' crash */ })
  const browser = new Browser(ws)
  browser.close = async () => {
    try { await browser.send('Browser.close', {}, undefined, 5000) } catch { /* ignore */ }
    try { ws.close() } catch { /* ignore */ }
    await cleanupAsync()
  }
  return browser
}

// ---------- shared CLI helpers ----------
export function parseArgs(argv, spec, usage = '') {
  const out = { _: [] }
  for (const [k, v] of Object.entries(spec)) out[k] = Array.isArray(v.default) ? [] : v.default
  const die = (msg) => { console.error(`${msg}\n\n${usage}`); process.exit(2) }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--help' || a === '-h') { console.log(usage); process.exit(0) }
    if (!a.startsWith('--')) { out._.push(a); continue }
    let key = a.slice(2)
    let value
    if (key.includes('=')) { value = key.slice(key.indexOf('=') + 1); key = key.slice(0, key.indexOf('=')) }
    const s = spec[key]
    if (!s) die(`Unknown option --${key}`)
    if (s.type === 'flag') { out[key] = true; continue }
    if (value === undefined) {
      value = argv[++i]
      if (value === undefined || value.startsWith('--')) die(`Option --${key} needs a value`)
    }
    if (s.type === 'list') out[key].push(value)
    else out[key] = value
  }
  return out
}

/** The usage text of a script = its leading comment block. */
export function usageFrom(fileUrl) {
  const src = fs.readFileSync(new URL(fileUrl), 'utf8').split('\n')
  const lines = []
  for (const l of src) { if (l.startsWith('#!')) continue; if (!l.startsWith('//')) break; lines.push(l.replace(/^\/\/ ?/, '')) }
  return lines.join('\n')
}

export async function emulate(page, { width, height, scheme, reducedMotion }) {
  await page.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 600 })
  await page.send('Emulation.setEmulatedMedia', {
    features: [
      { name: 'prefers-color-scheme', value: scheme },
      { name: 'prefers-reduced-motion', value: reducedMotion ? 'reduce' : 'no-preference' },
    ],
  })
}

export function defaultOutDir(prefix) {
  return path.join(os.tmpdir(), `${prefix}-${new Date().toISOString().replace(/[:.]/g, '-')}`)
}
