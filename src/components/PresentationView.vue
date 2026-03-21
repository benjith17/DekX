<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch, nextTick } from 'vue'
import { useDeck } from '../composables/useDeck'
import { usePresentation } from '../composables/usePresentation'
import { renderSlide } from '../utils/renderSlide'

const { slides, theme } = useDeck()
const {
  currentSlide,
  direction,
  totalSlides,
  nextSlide,
  prevSlide,
  stopPresentation,
} = usePresentation()

const slideEl = computed(() => slides.value[currentSlide.value] ?? null)

const rendered = computed(() => {
  if (!slideEl.value) return null
  return renderSlide(slideEl.value, theme.value)
})

// When going forward, the incoming slide defines the transition.
// When going backward, the slide we just left defines it (currentSlide + 1 after decrement).
const transitionName = computed(() => {
  const idx =
    direction.value === 'forward'
      ? currentSlide.value
      : currentSlide.value + 1
  const el = slides.value[idx]
  if (!el) return ''
  const t = el.getAttribute('transition')
  if (!t || t === 'none') return ''
  return `t-${t}-${direction.value}`
})

// Scale slide to fill viewport
const containerRef = ref<HTMLElement | null>(null)
const scale = ref(1)

function recalcScale() {
  if (!containerRef.value) return
  const vw = containerRef.value.clientWidth
  const vh = containerRef.value.clientHeight
  scale.value = Math.min(vw / 1280, vh / 720)
}

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  if (containerRef.value) {
    resizeObserver = new ResizeObserver(recalcScale)
    resizeObserver.observe(containerRef.value)
  }
  recalcScale()
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})

watch(slideEl, async () => {
  await nextTick()
  recalcScale()
})

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

// Also exit if user exits fullscreen via browser UI
function onFullscreenChange() {
  if (!document.fullscreenElement) {
    stopPresentation()
  }
}

onMounted(() => document.addEventListener('fullscreenchange', onFullscreenChange))
onUnmounted(() =>
  document.removeEventListener('fullscreenchange', onFullscreenChange),
)
</script>

<template>
  <div class="presentation-overlay" ref="containerRef">
    <div
      class="presentation-slide-scaler"
      :style="{
        transform: `scale(${scale})`,
      }"
    >
      <Transition :name="transitionName">
        <div
          v-if="rendered"
          :key="currentSlide"
          class="presentation-slide"
          :style="{
            background: rendered.theme.bg,
            color: rendered.theme.fg,
            fontFamily: rendered.theme.bFont,
          }"
        >
          <div
            class="presentation-slide-content"
            :style="{
              textAlign: rendered.layout.textAlign,
              justifyContent: rendered.layout.justifyContent,
              alignItems: rendered.layout.alignItems,
            }"
            v-html="rendered.html"
          ></div>
          <div
            class="presentation-page-num"
            :style="{ color: rendered.numColor, fontFamily: rendered.theme.hFont }"
          >
            {{ currentSlide + 1 }} / {{ totalSlides }}
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.presentation-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: none;
}

.presentation-overlay:hover {
  cursor: default;
}

.presentation-slide-scaler {
  width: 1280px;
  height: 720px;
  transform-origin: center center;
  flex-shrink: 0;
  position: relative;
}

.presentation-slide {
  width: 1280px;
  height: 720px;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
}

.presentation-slide-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 80px;
  gap: 28px;
  align-items: stretch;
  overflow: hidden;
}

.presentation-page-num {
  position: absolute;
  bottom: 32px;
  right: 48px;
  font-size: 18px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}

/* ── Fade transition ───────────────────────────────── */

.t-fade-forward-enter-active,
.t-fade-forward-leave-active,
.t-fade-backward-enter-active,
.t-fade-backward-leave-active {
  transition: opacity 0.35s ease;
}

.t-fade-forward-enter-from,
.t-fade-forward-leave-to,
.t-fade-backward-enter-from,
.t-fade-backward-leave-to {
  opacity: 0;
}

/* ── Slide transition ──────────────────────────────── */

.t-slide-forward-enter-active,
.t-slide-forward-leave-active,
.t-slide-backward-enter-active,
.t-slide-backward-leave-active {
  transition: transform 0.4s ease;
}

.t-slide-forward-enter-from {
  transform: translateX(100%);
}

.t-slide-forward-leave-to {
  transform: translateX(-100%);
}

.t-slide-backward-enter-from {
  transform: translateX(-100%);
}

.t-slide-backward-leave-to {
  transform: translateX(100%);
}
</style>
