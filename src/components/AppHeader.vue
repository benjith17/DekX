<script setup lang="ts">
import { computed } from 'vue'
import { useDeck } from '../composables/useDeck'
import { usePresentation } from '../composables/usePresentation'

const { metaTitle, slides, themeName, parseError } = useDeck()
const { startPresentation } = usePresentation()

const canPresent = computed(() => slides.value.length > 0 && !parseError.value)

const deckInfo = computed(() => {
  if (parseError.value) return 'parse error'
  const titlePart = metaTitle.value ? `"${metaTitle.value}"` : 'untitled deck'
  const count = slides.value.length
  return `${titlePart}  ·  ${count} slide${count !== 1 ? 's' : ''}  ·  theme:${themeName.value}`
})

const statusText = computed(() =>
  parseError.value ? `⚠ ${parseError.value.slice(0, 90)}` : '',
)
</script>

<template>
  <div id="header">
    <span class="logo">Dek<em>X</em></span>
    <div class="vr"></div>
    <span id="deck-info">{{ deckInfo }}</span>
    <button
      class="present-btn"
      :disabled="!canPresent"
      @click="startPresentation"
    >
      Present
    </button>
    <span id="status" :class="{ err: parseError }">{{ statusText }}</span>
  </div>
</template>

<style scoped>
#header {
  height: 42px;
  background: #0c0c0c;
  border-bottom: 1px solid #1e1e1e;
  display: flex;
  align-items: center;
  padding: 0 18px;
  gap: 16px;
  flex-shrink: 0;
  user-select: none;
}

.logo {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  letter-spacing: 0.02em;
}

.logo em {
  color: #7b6cf8;
  font-style: normal;
}

.vr {
  width: 1px;
  height: 14px;
  background: #3a3a3a;
}

#deck-info {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  color: #737373;
}

.present-btn {
  margin-left: auto;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  font-weight: 500;
  color: #fff;
  background: #7b6cf8;
  border: none;
  border-radius: 3px;
  padding: 4px 14px;
  cursor: pointer;
  letter-spacing: 0.02em;
  transition: opacity 0.2s;
}

.present-btn:hover:not(:disabled) {
  opacity: 0.85;
}

.present-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

#status {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  color: #737373;
  transition: color 0.2s;
}

#status.err {
  color: #e06c75;
}
</style>
