import { ref } from 'vue'

export interface Toast {
  id: number
  message: string
}

let nextId = 0
const toasts = ref<Toast[]>([])

function show(message: string, duration = 2000) {
  const id = nextId++
  toasts.value.push({ id, message })
  setTimeout(() => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }, duration)
}

export function useToast() {
  return { toasts, show }
}
