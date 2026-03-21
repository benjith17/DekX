<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useDeck } from '../composables/useDeck'
import { usePresentation } from '../composables/usePresentation'
import { renderSlide } from '../utils/renderSlide'
import {
  postMessage,
  onMessage as onBroadcastMessage,
} from '../composables/useBroadcast'
import type { BroadcastMessage, PresenterMessage } from '../composables/useBroadcast'

const { slides, theme } = useDeck()
const {
  currentSlide,
  direction,
  totalSlides,
  sessionId,
  audienceConnected,
  nextSlide,
  prevSlide,
  stopPresentation,
  reconnectAudience,
} = usePresentation()

// Current and next slide rendering
const currentSlideEl = computed(() => slides.value[currentSlide.value] ?? null)
const nextSlideEl = computed(() => slides.value[currentSlide.value + 1] ?? null)

const currentRendered = computed(() => {
  if (!currentSlideEl.value) return null
  return renderSlide(currentSlideEl.value, theme.value)
})

const nextRendered = computed(() => {
  if (!nextSlideEl.value) return null
  return renderSlide(nextSlideEl.value, theme.value)
})

// Broadcast slide update to audience
function broadcastCurrentSlide() {
  if (!currentSlideEl.value || !currentRendered.value) return
  const r = currentRendered.value
  const el = currentSlideEl.value
  const transition = el.getAttribute('transition') || ''

  const msg: PresenterMessage = {
    type: 'slide-update',
    sessionId: sessionId.value,
    slideHtml: r.html,
    theme: r.theme,
    layout: r.layout,
    index: currentSlide.value,
    total: totalSlides.value,
    transition,
    direction: direction.value,
  }
  postMessage(msg)
}

watch(currentSlide, () => broadcastCurrentSlide())

// Listen for audience messages
let cleanupListener: (() => void) | null = null

onMounted(() => {
  cleanupListener = onBroadcastMessage(
    sessionId.value,
    (msg: BroadcastMessage) => {
      if (msg.type === 'ready') {
        audienceConnected.value = true
        broadcastCurrentSlide()
      }
      if (msg.type === 'closed') {
        audienceConnected.value = false
      }
    },
  )
})

onUnmounted(() => {
  cleanupListener?.()
})

// Keyboard navigation
function onKeydown(e: KeyboardEvent) {
  switch (e.key) {
    case 'ArrowRight':
    case 'ArrowDown':
    case ' ':
    case 'Enter':
      e.preventDefault()
      nextSlide()
      break
    case 'ArrowLeft':
    case 'ArrowUp':
      e.preventDefault()
      prevSlide()
      break
    case 'Escape':
      e.preventDefault()
      stopPresentation()
      break
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))

// Scaling for slide previews
const currentContainer = ref<HTMLElement | null>(null)
const nextContainer = ref<HTMLElement | null>(null)
const currentScale = ref(1)
const nextScale = ref(1)

function recalcScales() {
  if (currentContainer.value) {
    const w = currentContainer.value.clientWidth
    currentScale.value = w / 1280
  }
  if (nextContainer.value) {
    const w = nextContainer.value.clientWidth
    nextScale.value = w / 1280
  }
}

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  resizeObserver = new ResizeObserver(recalcScales)
  if (currentContainer.value) resizeObserver.observe(currentContainer.value)
  if (nextContainer.value) resizeObserver.observe(nextContainer.value)
  recalcScales()
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})
</script>

<template>
  <div class="presenter-overlay">
    <div class="presenter-grid">
      <!-- Current slide (large) -->
      <div class="current-slide-area" ref="currentContainer">
        <div
          class="slide-scaler"
          :style="{ transform: `scale(${currentScale})`, height: `${720 * currentScale}px` }"
        >
          <div
            v-if="currentRendered"
            class="slide-frame"
            :style="{
              background: currentRendered.theme.bg,
              color: currentRendered.theme.fg,
              fontFamily: currentRendered.theme.bFont,
            }"
          >
            <div
              class="slide-content"
              :style="{
                textAlign: currentRendered.layout.textAlign,
                justifyContent: currentRendered.layout.justifyContent,
                alignItems: currentRendered.layout.alignItems,
              }"
              v-html="currentRendered.html"
            ></div>
            <div
              class="slide-page-num"
              :style="{ color: currentRendered.numColor, fontFamily: currentRendered.theme.hFont }"
            >
              {{ currentSlide + 1 }} / {{ totalSlides }}
            </div>
          </div>
        </div>
        <div class="slide-label">Current slide</div>
      </div>

      <!-- Next slide (smaller) -->
      <div class="next-slide-area" ref="nextContainer">
        <div
          class="slide-scaler"
          :style="{ transform: `scale(${nextScale})`, height: `${720 * nextScale}px` }"
        >
          <div
            v-if="nextRendered"
            class="slide-frame"
            :style="{
              background: nextRendered.theme.bg,
              color: nextRendered.theme.fg,
              fontFamily: nextRendered.theme.bFont,
            }"
          >
            <div
              class="slide-content"
              :style="{
                textAlign: nextRendered.layout.textAlign,
                justifyContent: nextRendered.layout.justifyContent,
                alignItems: nextRendered.layout.alignItems,
              }"
              v-html="nextRendered.html"
            ></div>
          </div>
          <div v-else class="slide-frame slide-frame-empty">
            <div class="empty-label">End of deck</div>
          </div>
        </div>
        <div class="slide-label">Next slide</div>
      </div>
    </div>

    <!-- Controls bar -->
    <div class="controls-bar">
      <button class="ctrl-btn" :disabled="currentSlide <= 0" @click="prevSlide">
        Prev
      </button>
      <div class="slide-counter">
        {{ currentSlide + 1 }} / {{ totalSlides }}
      </div>
      <button
        class="ctrl-btn"
        :disabled="currentSlide >= totalSlides - 1"
        @click="nextSlide"
      >
        Next
      </button>
      <div class="controls-spacer"></div>
      <div class="audience-status" :class="{ connected: audienceConnected }">
        {{ audienceConnected ? 'Audience connected' : 'Audience disconnected' }}
      </div>
      <button
        v-if="!audienceConnected"
        class="ctrl-btn ctrl-btn-subtle"
        @click="reconnectAudience"
      >
        Reconnect
      </button>
      <button class="ctrl-btn ctrl-btn-end" @click="stopPresentation">
        End show
      </button>
    </div>
  </div>
</template>

<style scoped>
.presenter-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #111118;
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 20px;
}

.presenter-grid {
  flex: 1;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  min-height: 0;
}

.current-slide-area,
.next-slide-area {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
  overflow: hidden;
}

.slide-label {
  font-family: 'IBM Plex Sans', system-ui, sans-serif;
  font-size: 13px;
  color: #808090;
}

.slide-scaler {
  width: 1280px;
  height: 720px;
  transform-origin: top left;
  flex-shrink: 0;
}

.slide-frame {
  width: 1280px;
  height: 720px;
  position: relative;
  overflow: hidden;
  border-radius: 4px;
}

.slide-frame-empty {
  background: #1a1a22;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-label {
  font-family: 'IBM Plex Sans', system-ui, sans-serif;
  font-size: 28px;
  color: #444;
}

.slide-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 80px;
  gap: 28px;
  align-items: stretch;
  overflow: hidden;
}

.slide-page-num {
  position: absolute;
  bottom: 32px;
  right: 48px;
  font-size: 18px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}

/* Controls */
.controls-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0 0;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
}

.slide-counter {
  font-family: 'IBM Plex Sans', system-ui, sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #eee;
  min-width: 80px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.ctrl-btn {
  font-family: 'IBM Plex Sans', system-ui, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #ddd;
  background: rgba(255, 255, 255, 0.08);
  border: none;
  border-radius: 6px;
  padding: 8px 20px;
  cursor: pointer;
  transition: background 0.15s;
}

.ctrl-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.14);
}

.ctrl-btn:disabled {
  opacity: 0.25;
  cursor: not-allowed;
}

.ctrl-btn-subtle {
  background: transparent;
  color: #808090;
}

.ctrl-btn-subtle:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.06);
  color: #ddd;
}

.ctrl-btn-end {
  background: rgba(224, 108, 117, 0.15);
  color: #e06c75;
}

.ctrl-btn-end:hover {
  background: rgba(224, 108, 117, 0.25);
}

.controls-spacer {
  flex: 1;
}

.audience-status {
  font-family: 'IBM Plex Sans', system-ui, sans-serif;
  font-size: 13px;
  color: #e06c75;
}

.audience-status.connected {
  color: #4ade80;
}
</style>
