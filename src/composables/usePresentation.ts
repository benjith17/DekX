import { ref, computed } from 'vue'
import { useDeck } from './useDeck'

const isPresenting = ref(false)
const currentSlide = ref(0)
const direction = ref<'forward' | 'backward'>('forward')

const { slides } = useDeck()
const totalSlides = computed(() => slides.value.length)

function startPresentation() {
  if (!slides.value.length) return
  currentSlide.value = 0
  isPresenting.value = true
  document.documentElement.requestFullscreen?.().catch(() => {
    // Fullscreen may be blocked — still present in-page
  })
}

function stopPresentation() {
  isPresenting.value = false
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

export function usePresentation() {
  return {
    isPresenting,
    currentSlide,
    direction,
    totalSlides,
    startPresentation,
    stopPresentation,
    nextSlide,
    prevSlide,
  }
}
