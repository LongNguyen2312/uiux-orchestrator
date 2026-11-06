#!/usr/bin/env node
// motion-trace — sample an element's animated properties on every frame after a trigger, as
// frame-level evidence for motion (quality-gates L4). Zero dependencies (Node 18+, Chrome).
//
// Usage:
//   node <skill-dir>/scripts/motion-trace.mjs <url> --target "<css>" [options]
//
// Options:
//   --target "<css>"        element to sample (may appear only after the trigger)
//   --trigger "<css>"       element to click to start the motion (omit to sample from load)
//   --props opacity,transform,height   computed properties to sample (default shown)
//   --duration 1200         ms to sample after the trigger
//   --width 390 --height 844
//   --scheme light|dark
//   --reduced-motion        emulate prefers-reduced-motion: reduce
//   --frames 0              also save N screenshots spread over the motion, captured with
//                           animations slowed 10× (CSS/WAAPI only; rAF-driven JS is not slowed)
//   --wait 400              ms to settle after load before triggering
//   --out <dir>             output folder (default: a new folder in the OS temp dir)
//   --help                  print this text
// Note: the trigger is a synthetic click, so :hover/:active press styles are not exercised.
//
// Output: trace.json (every sample) + a summary: when each property started and stopped
// changing, start → end values, frame count, longest gap between frames (> 34 ms ≈ dropped
// frames at 60 Hz) and a short timeline. Headless timing approximates, but is not, a device.
import fs from 'node:fs'
import path from 'node:path'
import { defaultOutDir, emulate, launchBrowser, parseArgs, usageFrom } from './lib/cdp.mjs'

const args = parseArgs(process.argv.slice(2), {
  target: { default: '' },
  trigger: { default: '' },
  props: { default: 'opacity,transform,height' },
  duration: { default: '1200' },
  width: { default: '390' },
  height: { default: '844' },
  scheme: { default: 'light' },
  'reduced-motion': { type: 'flag', default: false },
  frames: { default: '0' },
  wait: { default: '400' },
  out: { default: '' },
}, usageFrom(import.meta.url))
const url = args._[0]
if (!url || !args.target) {
  console.error(usageFrom(import.meta.url))
  process.exit(2)
}
const out = args.out || defaultOutDir('uiux-motion')
fs.mkdirSync(out, { recursive: true })
const props = args.props.split(',').map((p) => p.trim()).filter(Boolean)
const duration = Number(args.duration)

const SAMPLER = `new Promise((resolve) => {
  const T = ${JSON.stringify(args.target)}, TRIG = ${JSON.stringify(args.trigger)}, P = ${JSON.stringify(props)}, D = ${duration}
  const samples = []; let t0 = null
  const tick = (now) => {
    if (t0 === null) { t0 = now; if (TRIG) { const b = document.querySelector(TRIG); if (b) b.click(); else { resolve({ error: 'trigger not found: ' + TRIG }); return } } }
    const el = document.querySelector(T), s = { t: Math.round((now - t0) * 10) / 10 }
    if (el) { const cs = getComputedStyle(el), r = el.getBoundingClientRect()
      for (const p of P) s[p] = cs.getPropertyValue(p)
      s.box = [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)].join(',') } else s.missing = true
    samples.push(s)
    if (now - t0 < D) requestAnimationFrame(tick); else resolve({ samples })
  }
  requestAnimationFrame(tick)
})`

const browser = await launchBrowser().catch((e) => { console.error(String(e.message || e)); process.exit(2) })
let result
let failure = null
try {
  const page = await browser.newPage()
  await emulate(page, { width: Number(args.width), height: Number(args.height), scheme: args.scheme, reducedMotion: args['reduced-motion'] })
  await page.goto(url, Number(args.wait))
  result = await page.evaluate(SAMPLER)
  const frames = Number(args.frames)
  if (frames > 0 && !result.error) {
    await page.reload(Number(args.wait)) // same-URL navigation would not reset hash-routed state
    await page.send('Animation.enable')
    await page.send('Animation.setPlaybackRate', { playbackRate: 0.1 })
    if (args.trigger) await page.evaluate(`document.querySelector(${JSON.stringify(args.trigger)})?.click()`)
    const step = (duration * 10) / frames
    for (let i = 0; i < frames; i++) {
      await new Promise((r) => setTimeout(r, i === 0 ? 30 : step))
      const shot = await page.send('Page.captureScreenshot', { format: 'png' })
      fs.writeFileSync(path.join(out, `frame-${String(i).padStart(2, '0')}.png`), Buffer.from(shot.data, 'base64'))
    }
  }
  await page.close()
} catch (e) {
  failure = e
} finally {
  await browser.close()
}
if (failure) { console.error(`motion-trace failed: ${failure.message}\nNo trace was produced; this is not evidence.`); process.exit(1) }
if (result.error) { console.error(result.error); process.exit(1) }

const samples = result.samples
fs.writeFileSync(path.join(out, 'trace.json'), JSON.stringify({ url, target: args.target, trigger: args.trigger, props, samples }, null, 2))

const keys = [...props, 'box']
const appeared = samples.findIndex((s) => !s.missing)
const present = appeared >= 0 ? samples.slice(appeared) : []
const summary = {}
for (const k of keys) {
  const vals = present.map((s) => s[k])
  let first = null, last = null
  for (let i = 1; i < vals.length; i++) if (vals[i] !== vals[i - 1]) { if (first === null) first = present[i].t; last = present[i].t }
  summary[k] = { changed: first !== null, start: vals.find((v) => v !== undefined), end: vals[vals.length - 1], firstChangeMs: first, settledMs: last }
}
const gaps = samples.slice(1).map((s, i) => s.t - samples[i].t)
const maxGap = gaps.length ? Math.max(...gaps) : 0
const dropped = gaps.filter((g) => g > 34).length

console.log(`motion-trace ${url}\ntarget: ${args.target}${args.trigger ? `   trigger: ${args.trigger}` : ''}${args['reduced-motion'] ? '   (reduced motion)' : ''}\nout: ${out}`)
console.log(`frames: ${samples.length} in ${duration} ms · longest frame gap ${Math.round(maxGap)} ms · gaps > 34 ms: ${dropped}`)
if (appeared > 0) console.log(`target appeared at ${samples[appeared].t} ms`)
if (appeared === -1) console.log('target never appeared')
for (const k of keys) {
  const s = summary[k]
  console.log(s.changed
    ? `  ${k}: ${s.start} → ${s.end}   changes ${s.firstChangeMs}–${s.settledMs} ms`
    : `  ${k}: unchanged (${s.start ?? 'n/a'})`)
}
const changedKeys = keys.filter((k) => summary[k].changed)
if (changedKeys.length) {
  const k = changedKeys[0]
  const end = summary[k].settledMs ?? 0
  const marks = [0, 0.1, 0.25, 0.5, 0.75, 1].map((f) => f * end)
  console.log(`  timeline (${k}):`)
  for (const m of marks) {
    const s = present.reduce((a, b) => (Math.abs(b.t - m) < Math.abs(a.t - m) ? b : a))
    console.log(`    ${String(Math.round(s.t)).padStart(5)} ms  ${s[k]}`)
  }
} else if (appeared > 0) {
  console.log(`  → instant: the target appeared at ${samples[appeared].t} ms already in its final state (no transition)`)
} else {
  console.log('  nothing changed: either no motion, an instant change before the first frame, or the wrong --target')
}
