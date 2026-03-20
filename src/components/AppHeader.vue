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
  height: 48px;
  background: #131318;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 16px;
  flex-shrink: 0;
  user-select: none;
}

.logo {
  font-family: 'IBM Plex Sans', system-ui, sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #eee;
  letter-spacing: -0.01em;
}

.logo em {
  color: #7b6cf8;
  font-style: normal;
}

.vr {
  width: 1px;
  height: 18px;
  background: rgba(255, 255, 255, 0.08);
}

#deck-info {
  font-size: 13px;
  color: #808090;
}

.present-btn {
  margin-left: auto;
  font-family: 'IBM Plex Sans', system-ui, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  background: #7b6cf8;
  border: none;
  border-radius: 6px;
  padding: 6px 18px;
  cursor: pointer;
  transition: background 0.15s;
}

.present-btn:hover:not(:disabled) {
  background: #6b5ce8;
}

.present-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

#status {
  font-size: 13px;
  color: #808090;
  transition: color 0.2s;
}

#status.err {
  color: #e06c75;
}
</style>
