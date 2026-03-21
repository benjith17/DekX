import type { ThemeConfig } from '../types/theme'
import type { SlideLayout } from '../utils/renderSlide'

// Messages from presenter → audience
export type PresenterMessage =
  | {
      type: 'slide-update'
      sessionId: string
      slideHtml: string
      theme: ThemeConfig
      layout: SlideLayout
      index: number
      total: number
      transition: string
      direction: 'forward' | 'backward'
    }
  | { type: 'end'; sessionId: string }

// Messages from audience → presenter
export type AudienceMessage =
  | { type: 'ready'; sessionId: string }
  | { type: 'closed'; sessionId: string }

export type BroadcastMessage = PresenterMessage | AudienceMessage

const CHANNEL_NAME = 'dekx-present'

let channel: BroadcastChannel | null = null

function getChannel(): BroadcastChannel {
  if (!channel) {
    channel = new BroadcastChannel(CHANNEL_NAME)
  }
  return channel
}

export function postMessage(msg: BroadcastMessage): void {
  getChannel().postMessage(msg)
}

export function onMessage(
  sessionId: string,
  handler: (msg: BroadcastMessage) => void,
): () => void {
  const ch = getChannel()
  const listener = (e: MessageEvent<BroadcastMessage>) => {
    if (e.data?.sessionId === sessionId) {
      handler(e.data)
    }
  }
  ch.addEventListener('message', listener)
  return () => ch.removeEventListener('message', listener)
}

export function closeChannel(): void {
  channel?.close()
  channel = null
}
