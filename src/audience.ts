import type { PresenterMessage } from './composables/useBroadcast'

const CHANNEL_NAME = 'dekx-present'
const channel = new BroadcastChannel(CHANNEL_NAME)

const scaler = document.getElementById('scaler')!
const container = document.getElementById('audience')!

let currentSlideEl: HTMLElement | null = null
let sessionId: string | null = null

// Scaling
function recalcScale() {
  const vw = container.clientWidth
  const vh = container.clientHeight
  const scale = Math.min(vw / 1280, vh / 720)
  scaler.style.transform = `scale(${scale})`
}

new ResizeObserver(recalcScale).observe(container)
recalcScale()

// Try fullscreen on first click (browsers require user gesture)
document.addEventListener(
  'click',
  () => {
    document.documentElement.requestFullscreen?.().catch(() => {})
  },
  { once: true },
)

function createSlideEl(msg: Extract<PresenterMessage, { type: 'slide-update' }>): HTMLElement {
  const slide = document.createElement('div')
  slide.className = 'slide'
  slide.style.background = msg.theme.bg
  slide.style.color = msg.theme.fg
  slide.style.fontFamily = msg.theme.bFont

  const content = document.createElement('div')
  content.className = 'slide-content'
  content.style.textAlign = msg.layout.textAlign
  content.style.justifyContent = msg.layout.justifyContent
  content.style.alignItems = msg.layout.alignItems
  content.innerHTML = msg.slideHtml

  const pageNum = document.createElement('div')
  pageNum.className = 'page-num'
  pageNum.style.color = msg.theme.isLight ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.12)'
  pageNum.style.fontFamily = msg.theme.hFont
  pageNum.textContent = `${msg.index + 1} / ${msg.total}`

  slide.appendChild(content)
  slide.appendChild(pageNum)
  return slide
}

function getTransitionClasses(
  transition: string,
  direction: 'forward' | 'backward',
): { enter: string; leave: string; active: string } | null {
  if (!transition || transition === 'none') return null
  if (transition === 'fade') {
    return { enter: 't-fade-enter', leave: 't-fade-leave', active: 't-fade-active' }
  }
  if (transition === 'slide') {
    const key = `t-slide-${direction}`
    return { enter: `${key}-enter`, leave: `${key}-leave`, active: `${key}-active` }
  }
  return null
}

function showSlide(msg: Extract<PresenterMessage, { type: 'slide-update' }>) {
  const newSlide = createSlideEl(msg)
  const oldSlide = currentSlideEl
  const tc = getTransitionClasses(msg.transition, msg.direction)

  if (!tc || !oldSlide) {
    // No transition or first slide — just swap
    if (oldSlide) oldSlide.remove()
    scaler.appendChild(newSlide)
    currentSlideEl = newSlide
    return
  }

  // Animate: enter new, leave old
  newSlide.classList.add(tc.enter)
  scaler.appendChild(newSlide)

  // Force reflow
  void newSlide.offsetHeight

  // Start transitions
  newSlide.classList.add(tc.active)
  newSlide.classList.remove(tc.enter)

  oldSlide.classList.add(tc.active, tc.leave)

  const duration = 450 // slightly longer than CSS to be safe
  setTimeout(() => {
    oldSlide.remove()
  }, duration)

  currentSlideEl = newSlide
}

channel.addEventListener('message', (e: MessageEvent<PresenterMessage>) => {
  const msg = e.data
  if (!msg?.type) return

  if (msg.type === 'slide-update') {
    if (!sessionId) sessionId = msg.sessionId
    if (msg.sessionId !== sessionId) return
    showSlide(msg)
  }

  if (msg.type === 'end') {
    if (msg.sessionId !== sessionId) return
    window.close()
  }
})

// Notify presenter we're ready
// Use a small delay to ensure the presenter's listener is set up
setTimeout(() => {
  // Read session ID from URL hash if available
  const hashId = window.location.hash.slice(1)
  if (hashId) sessionId = hashId
  channel.postMessage({ type: 'ready', sessionId: sessionId || '' })
}, 100)

// Notify on close
window.addEventListener('beforeunload', () => {
  if (sessionId) {
    channel.postMessage({ type: 'closed', sessionId })
  }
})
