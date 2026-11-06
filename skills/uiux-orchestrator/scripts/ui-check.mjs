#!/usr/bin/env node
// ui-check — render a web page at several sizes/themes, capture screenshots and report
// mechanical UI defects. Zero dependencies (Node 18+, an installed Chrome/Chromium/Edge).
//
// Usage:
//   node <skill-dir>/scripts/ui-check.mjs <url> [options]
//
// Options:
//   --widths 390,768,1280     viewport widths (default 390,768,1280)
//   --height 900              viewport height
//   --schemes light,dark      color schemes to emulate (default light)
//   --reduced-motion          emulate prefers-reduced-motion: reduce
//   --click "<css selector>"  click before checking (repeatable, in order)
//   --wait 400                ms to settle after load and after each click
//   --full                    full-page screenshots
//   --name shot               file name prefix
//   --out <dir>               output folder (default: a new folder in the OS temp dir)
//   --no-shots                checks only
//   --help                    print this text
// Values may also be written --widths=390,1280. Exit code 1 = the page did not load (no report).
//
// Output: PNG screenshots + report.json in --out, and a readable summary on stdout.
// Reports: horizontal overflow (with offending elements), clipped text, text contrast below
// WCAG AA (4.5:1, 3:1 for large text), targets under 24×24 CSS px (WCAG 2.5.8), controls and
// links without an accessible name, placeholder-only fields, images without alt, pointer-styled
// elements that are not keyboard-operable (e.g. <div onClick>), console errors.
// These are mechanical checks: they support, not replace, looking at the screenshots.
import fs from 'node:fs'
import path from 'node:path'
import { defaultOutDir, emulate, launchBrowser, parseArgs, usageFrom } from './lib/cdp.mjs'

const args = parseArgs(process.argv.slice(2), {
  widths: { default: '390,768,1280' },
  height: { default: '900' },
  schemes: { default: 'light' },
  'reduced-motion': { type: 'flag', default: false },
  click: { type: 'list', default: [] },
  wait: { default: '400' },
  full: { type: 'flag', default: false },
  name: { default: 'shot' },
  out: { default: '' },
  'no-shots': { type: 'flag', default: false },
}, usageFrom(import.meta.url))
const url = args._[0]
if (!url) {
  console.error(usageFrom(import.meta.url))
  process.exit(2)
}
const out = args.out || defaultOutDir('uiux-check')
fs.mkdirSync(out, { recursive: true })
const wait = Number(args.wait)

// Runs inside the page. Returns plain data.
// Mobile emulation lets Chrome widen the layout viewport to fit overflowing content (like a phone
// zooming out), so overflow is measured against the requested width, not innerWidth.
const CHECKS = (requested) => `(() => {
  const W = ${requested}, LIMIT = 12
  const res = { docWidth: Math.max(document.documentElement.scrollWidth, innerWidth), viewport: W,
    overflowX: Math.max(document.documentElement.scrollWidth, innerWidth) > W + 1,
    offenders: [], clipped: [], contrast: [], contrastSkipped: 0, smallTargets: [], unnamed: [], placeholderOnly: [], imgNoAlt: [], pointerNotFocusable: [] }
  const visible = (el) => { const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return false
    const cs = getComputedStyle(el); return cs.visibility !== 'hidden' && cs.display !== 'none' && parseFloat(cs.opacity) > 0.01 }
  const label = (el) => { let s = el.tagName.toLowerCase(); if (el.id) s += '#' + el.id
    if (el.matches('input[type=checkbox],input[type=radio]') && el.labels && el.labels.length) return s + ' "' + [...el.labels].map((l) => l.innerText).join(' ').trim().slice(0, 40) + '"'
    const c = (el.getAttribute('class') || '').trim().split(/\\s+/).filter(Boolean).slice(0, 2); if (c.length) s += '.' + c.join('.')
    const t = (el.innerText || el.value || el.getAttribute('aria-label') || el.getAttribute('placeholder') || '').trim().replace(/\\s+/g, ' ').slice(0, 40)
    return t ? s + ' "' + t + '"' : s }
  const cv = document.createElement('canvas'); cv.width = cv.height = 1; const cx = cv.getContext('2d', { willReadFrequently: true }); const cache = new Map()
  const rgba = (c) => { if (cache.has(c)) return cache.get(c); cx.clearRect(0, 0, 1, 1); cx.fillStyle = '#000'; cx.fillStyle = c; cx.fillRect(0, 0, 1, 1)
    const d = cx.getImageData(0, 0, 1, 1).data; const v = [d[0], d[1], d[2], d[3] / 255]; cache.set(c, v); return v }
  const blend = (fg, bg) => [0, 1, 2].map((i) => fg[i] * fg[3] + bg[i] * (1 - fg[3])).concat(1)
  const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]) }
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05) }
  const background = (el) => { const layers = []
    for (let n = el; n; n = n.parentElement) { const cs = getComputedStyle(n)
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return null
      const c = rgba(cs.backgroundColor); if (c[3] > 0) { layers.push(c); if (c[3] >= 1) break } }
    let bg = [255, 255, 255, 1]; for (let i = layers.length - 1; i >= 0; i--) bg = blend(layers[i], bg); return bg }
  const name = (el) => { const a = el.getAttribute('aria-label'); if (a && a.trim()) return a.trim()
    const lb = el.getAttribute('aria-labelledby'); if (lb) { const t = lb.split(/\\s+/).map((id) => document.getElementById(id)?.innerText || '').join(' ').trim(); if (t) return t }
    if (el.labels && el.labels.length) { const t = [...el.labels].map((l) => l.innerText).join(' ').trim(); if (t) return t }
    if (el.matches('input[type=submit],input[type=button],input[type=reset]')) return (el.value || '').trim()
    if (!el.matches('input,select,textarea')) { const t = (el.innerText || '').trim(); if (t) return t
      const img = el.querySelector('img[alt]'); if (img && img.alt.trim()) return img.alt.trim()
      const svgT = el.querySelector('svg title'); if (svgT && svgT.textContent.trim()) return svgT.textContent.trim() }
    return (el.getAttribute('title') || '').trim() }
  // Overflow inside a scroll/clip container (e.g. a horizontally scrolling nav) does not widen the page.
  const contained = (el) => { for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
    if (['auto', 'scroll', 'hidden', 'clip'].includes(getComputedStyle(a).overflowX) && a.getBoundingClientRect().right <= W + 1) return true } return false }
  const seen = new Set()
  for (const el of document.body.querySelectorAll('*')) {
    if (!visible(el)) continue
    const r = el.getBoundingClientRect(), cs = getComputedStyle(el)
    if (res.overflowX && r.right > W + 1 && res.offenders.length < LIMIT && !contained(el)) { const p = el.parentElement
      if (!p || p.getBoundingClientRect().right <= W + 1) res.offenders.push({ el: label(el), right: Math.round(r.right) }) }
    const hidesX = ['hidden', 'clip'].includes(cs.overflowX) || cs.textOverflow === 'ellipsis'
    if (hidesX && el.scrollWidth > el.clientWidth + 1 && (el.innerText || '').trim() && res.clipped.length < LIMIT)
      res.clipped.push({ el: label(el), contentWidth: el.scrollWidth, boxWidth: el.clientWidth })
    const ownText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())
      || (el.matches('input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=color]),textarea,select') && (el.value || '').trim())
    if (ownText && res.contrast.length < LIMIT) { const bg = background(el)
      if (!bg) res.contrastSkipped++
      if (bg) { const fg = blend(rgba(cs.color), bg), cr = ratio(fg, bg), size = parseFloat(cs.fontSize), weight = parseInt(cs.fontWeight, 10) || 400
        const large = size >= 24 || (size >= 18.66 && weight >= 700), need = large ? 3 : 4.5
        const key = cs.color + '|' + bg.join(',') + '|' + size
        if (cr < need && !seen.has(key)) { seen.add(key); res.contrast.push({ el: label(el), ratio: Math.round(cr * 100) / 100, need, fontSize: size, color: cs.color }) } } }
  }
  if (res.overflowX && !res.offenders.length) {
    // Second pass: content spilling out of a box that itself fits (e.g. long text in a narrow card).
    const spill = []
    for (const el of document.body.querySelectorAll('*')) {
      if (!visible(el) || contained(el)) continue
      const r = el.getBoundingClientRect()
      if (getComputedStyle(el).overflowX === 'visible' && el.scrollWidth > el.clientWidth + 1 && r.left + el.scrollWidth > W + 1) spill.push(el)
    }
    for (const el of spill) if (!spill.some((o) => o !== el && el.contains(o)) && res.offenders.length < LIMIT)
      res.offenders.push({ el: label(el) + ' (content spills)', right: Math.round(el.getBoundingClientRect().left + el.scrollWidth) })
  }
  const interactiveSel = 'a[href],button,input,select,textarea,summary,label,[role],[tabindex]'
  for (const el of document.body.querySelectorAll('*')) {
    if (res.pointerNotFocusable.length >= LIMIT) break
    if (!visible(el) || getComputedStyle(el).cursor !== 'pointer') continue
    if (el.closest(interactiveSel)) continue
    if (el.parentElement && getComputedStyle(el.parentElement).cursor === 'pointer' && !el.parentElement.closest(interactiveSel)) continue
    res.pointerNotFocusable.push({ el: label(el) })
  }
  const interactive = 'a[href],button,input:not([type=hidden]),select,textarea,summary,[role=button],[role=link],[role=checkbox],[role=switch],[role=tab],[tabindex]:not([tabindex="-1"])'
  for (const el of document.querySelectorAll(interactive)) {
    if (!visible(el)) continue
    const r = el.getBoundingClientRect()
    const inline = el.matches('a') && el.closest('p,li,td') && (el.closest('p,li,td').innerText || '').trim().length > (el.innerText || '').trim().length + 3
    if ((r.width < 24 || r.height < 24) && !inline && res.smallTargets.length < LIMIT) res.smallTargets.push({ el: label(el), w: Math.round(r.width), h: Math.round(r.height) })
    if (!name(el) && res.unnamed.length < LIMIT) {
      if (el.matches('input,textarea') && el.getAttribute('placeholder')) res.placeholderOnly.push({ el: label(el) })
      else res.unnamed.push({ el: label(el) }) }
  }
  for (const img of document.querySelectorAll('img')) if (!img.hasAttribute('alt') && visible(img) && res.imgNoAlt.length < LIMIT) res.imgNoAlt.push({ el: label(img), src: (img.currentSrc || img.src || '').slice(-60) })
  return res
})()`

const browser = await launchBrowser().catch((e) => { console.error(String(e.message || e)); process.exit(2) })
const report = { url, generated: new Date().toISOString(), variants: [] }
let failure = null
try {
  for (const scheme of args.schemes.split(',')) {
    for (const width of args.widths.split(',').map(Number)) {
      const page = await browser.newPage()
      const consoleErrors = []
      page.on('Runtime.exceptionThrown', (p) => consoleErrors.push(p.exceptionDetails?.exception?.description || p.exceptionDetails?.text))
      page.on('Runtime.consoleAPICalled', (p) => { if (p.type === 'error') consoleErrors.push(p.args.map((a) => a.value ?? a.description ?? '').join(' ')) })
      page.on('Log.entryAdded', (p) => { if (p.entry.level === 'error') consoleErrors.push(p.entry.text + (p.entry.url ? ` (${p.entry.url})` : '')) })
      await emulate(page, { width, height: Number(args.height), scheme, reducedMotion: args['reduced-motion'] })
      await page.goto(url, wait)
      for (const sel of args.click) {
        const ok = await page.evaluate(`(() => { const el = document.querySelector(${JSON.stringify(sel)}); if (!el) return false; el.click(); return true })()`)
        if (!ok) consoleErrors.push(`[ui-check] --click selector not found: ${sel}`)
        await new Promise((r) => setTimeout(r, wait))
      }
      const checks = await page.evaluate(CHECKS(width))
      let file = null
      if (!args['no-shots']) {
        const suffix = `${width}-${scheme}${args['reduced-motion'] ? '-rm' : ''}`
        file = path.join(out, `${args.name}-${suffix}.png`)
        let clip
        if (args.full) {
          const m = await page.send('Page.getLayoutMetrics')
          const size = m.cssContentSize || m.contentSize
          clip = { x: 0, y: 0, width: Math.ceil(size.width), height: Math.ceil(size.height), scale: 1 }
        }
        const shot = await page.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: args.full, ...(clip ? { clip } : {}) })
        fs.writeFileSync(file, Buffer.from(shot.data, 'base64'))
      }
      report.variants.push({ width, scheme, reducedMotion: args['reduced-motion'], screenshot: file, consoleErrors, ...checks })
      await page.close()
    }
  }
} catch (e) {
  failure = e
} finally {
  await browser.close()
}
if (failure) {
  console.error(`ui-check failed: ${failure.message}\nNo report was produced; this is not evidence.`)
  process.exit(1)
}
fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 2))

// Human summary
const line = (items, fmt) => items.slice(0, 5).map((x) => '      - ' + fmt(x)).join('\n')
console.log(`ui-check ${url}\nout: ${out}`)
for (const v of report.variants) {
  const issues = []
  if (v.overflowX) issues.push(`  horizontal overflow (document ${v.docWidth}px > ${v.viewport}px)\n${line(v.offenders, (o) => `${o.el} → right edge ${o.right}px`)}`)
  if (v.clipped.length) issues.push(`  clipped text: ${v.clipped.length}\n${line(v.clipped, (c) => `${c.el} (${c.contentWidth}px content in ${c.boxWidth}px box)`)}`)
  if (v.contrast.length) issues.push(`  low contrast: ${v.contrast.length}\n${line(v.contrast, (c) => `${c.el} ${c.ratio}:1 (needs ${c.need}:1, ${c.fontSize}px)`)}`)
  if (v.smallTargets.length) issues.push(`  targets < 24×24: ${v.smallTargets.length}\n${line(v.smallTargets, (t) => `${t.el} ${t.w}×${t.h}`)}`)
  if (v.unnamed.length) issues.push(`  no accessible name: ${v.unnamed.length}\n${line(v.unnamed, (u) => u.el)}`)
  if (v.placeholderOnly.length) issues.push(`  placeholder-only fields: ${v.placeholderOnly.length}\n${line(v.placeholderOnly, (u) => u.el)}`)
  if (v.pointerNotFocusable.length) issues.push(`  clickable-looking but not keyboard-operable (cursor:pointer, no button/link/role): ${v.pointerNotFocusable.length}\n${line(v.pointerNotFocusable, (u) => u.el)}`)
  if (v.imgNoAlt.length) issues.push(`  images without alt: ${v.imgNoAlt.length}`)
  if (v.contrastSkipped) issues.push(`  contrast not measured over background images: ${v.contrastSkipped} text element(s) — check in the screenshot`)
  if (v.consoleErrors.length) issues.push(`  console errors: ${v.consoleErrors.length}\n${line(v.consoleErrors, (e) => String(e).slice(0, 140))}`)
  console.log(`\n[${v.width}px ${v.scheme}${v.reducedMotion ? ' reduced-motion' : ''}] ${v.screenshot || '(no screenshot)'}`)
  console.log(issues.length ? issues.join('\n') : '  no mechanical issues found')
}
