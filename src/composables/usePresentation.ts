import { ref, computed, shallowRef } from 'vue'
import { useDeck } from './useDeck'
import { postMessage } from './useBroadcast'

const isPresenting = ref(false)
const currentSlide = ref(0)
const direction = ref<'forward' | 'backward'>('forward')
const presentMode = ref<'single' | 'presenter'>('single')
const sessionId = ref('')
const audienceConnected = ref(false)
const audienceWindow = shallowRef<Window | null>(null)

const { slides } = useDeck()
const totalSlides = computed(() => slides.value.length)

function generateSessionId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

function startPresentation(mode: 'single' | 'presenter' = 'presenter') {
  if (!slides.value.length) return

  currentSlide.value = 0
  direction.value = 'forward'
  sessionId.value = generateSessionId()

  if (mode === 'presenter') {
    const win = window.open(
      `/audience.html#${sessionId.value}`,
      'dekx-audience',
      'popup,menubar=no,toolbar=no,location=no,status=no,width=1280,height=720',
    )

    if (win) {
      audienceWindow.value = win
      audienceConnected.value = false
      presentMode.value = 'presenter'
      isPresenting.value = true
      return
    }
    // Popup blocked — fall through to single-window
  }

  presentMode.value = 'single'
  isPresenting.value = true
  document.documentElement.requestFullscreen?.().catch(() => {})
}

function stopPresentation() {
  if (presentMode.value === 'presenter') {
    postMessage({ type: 'end', sessionId: sessionId.value })
    try {
      audienceWindow.value?.close()
    } catch {
      // cross-origin or already closed
    }
    audienceWindow.value = null
    audienceConnected.value = false
  }

  isPresenting.value = false
  presentMode.value = 'single'

  if (document.fullscreenElement) {
    document.exitFullscreen?.()
  }
}

function nextSlide() {
  if (currentSlide.value < totalSlides.value - 1) {
    direction.value = 'forward'
    currentSlide.value++
  }
}

function prevSlide() {
  if (currentSlide.value > 0) {
    direction.value = 'backward'
    currentSlide.value--
  }
}

function reconnectAudience() {
  if (!isPresenting.value || presentMode.value !== 'presenter') return
  const win = window.open(
    `/audience.html#${sessionId.value}`,
    'dekx-audience',
    'popup,menubar=no,toolbar=no,location=no,status=no,width=1280,height=720',
  )
  if (win) {
    audienceWindow.value = win
    audienceConnected.value = false
  }
}

export function usePresentation() {
  return {
    isPresenting,
    currentSlide,
    direction,
    totalSlides,
    presentMode,
    sessionId,
    audienceConnected,
    startPresentation,
    stopPresentation,
    nextSlide,
    prevSlide,
    reconnectAudience,
  }
}
