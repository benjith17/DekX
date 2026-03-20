import { onMounted, onUnmounted, type Ref } from 'vue'

const SLIDE_WIDTH = 1280
const SLIDE_HEIGHT = 720

export function useScaler(containerRef: Ref<HTMLElement | null>) {
  let observer: ResizeObserver | null = null

  function scaleAll() {
    const container = containerRef.value
    if (!container) return

    container.querySelectorAll('.slide-container').forEach((c) => {
      const scaler = c.querySelector<HTMLElement>('.slide-scaler')
      if (!scaler) return
      const scale = (c as HTMLElement).clientWidth / SLIDE_WIDTH
      scaler.style.transform = `scale(${scale})`
      ;(c as HTMLElement).style.height = `${SLIDE_HEIGHT * scale}px`
    })
  }

  onMounted(() => {
    const el = containerRef.value
    if (el) {
      observer = new ResizeObserver(scaleAll)
      observer.observe(el)
    }
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  return { scaleAll }
}
