// Screenshot harness for this fixture. Uses the system Chrome via puppeteer-core (no browser download).
// Usage:
//   node scripts/shoot.mjs --url http://localhost:5173/#/settings --out shots --name settings \
//     [--widths 390,768,1280] [--scheme light|dark] [--reduced-motion] [--click "<css selector>"]... \
//     [--wait 300] [--full] [--height 900]
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

const args = process.argv.slice(2)
const opt = (k, d) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : d }
const flag = (k) => args.includes(`--${k}`)
const clicks = args.flatMap((a, i) => (a === '--click' ? [args[i + 1]] : []))

const url = opt('url')
if (!url) { console.error('--url is required'); process.exit(2) }
const out = opt('out', 'shots')
const name = opt('name', 'shot')
const widths = opt('widths', '390,768,1280').split(',').map(Number)
const scheme = opt('scheme', 'light')
const wait = Number(opt('wait', '300'))
const height = Number(opt('height', '900'))
const chrome = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

mkdirSync(out, { recursive: true })
const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ['--no-first-run', '--no-default-browser-check'] })
const errors = []
try {
  for (const w of widths) {
    const page = await browser.newPage()
    page.on('pageerror', (e) => errors.push(String(e)))
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
    await page.setViewport({ width: w, height, deviceScaleFactor: 1 })
    await page.emulateMediaFeatures([
      { name: 'prefers-color-scheme', value: scheme },
      { name: 'prefers-reduced-motion', value: flag('reduced-motion') ? 'reduce' : 'no-preference' },
    ])
    await page.goto(url, { waitUntil: 'networkidle0' })
    for (const sel of clicks) { await page.click(sel); await new Promise((r) => setTimeout(r, wait)) }
    await new Promise((r) => setTimeout(r, wait))
    const overflowX = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
    const file = join(out, `${name}-${w}-${scheme}${flag('reduced-motion') ? '-rm' : ''}.png`)
    await page.screenshot({ path: file, fullPage: flag('full') })
    console.log(`${file}${overflowX ? '  (horizontal overflow!)' : ''}`)
    await page.close()
  }
} finally {
  await browser.close()
}
if (errors.length) { console.log('page errors:'); for (const e of errors) console.log('  ' + e) }
