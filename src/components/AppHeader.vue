<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDeck } from '../composables/useDeck'
import { usePresentation } from '../composables/usePresentation'
import { useFileOps } from '../composables/useFileOps'

const { metaTitle, slides, themeName, parseError, availableThemes, setTheme } =
  useDeck()
const { startPresentation } = usePresentation()
const { currentFileName, isDirty, newFile, openFile, saveFile, saveFileAs } =
  useFileOps()

const canPresent = computed(() => slides.value.length > 0 && !parseError.value)
const showPresentMenu = ref(false)

const deckInfo = computed(() => {
  if (parseError.value) return 'parse error'
  const filePart = currentFileName.value
    ? currentFileName.value + (isDirty.value ? ' ·' : '')
    : 'unsaved'
  const titlePart = metaTitle.value || 'untitled'
  const count = slides.value.length
  return `${filePart}  —  ${titlePart}  ·  ${count} slide${count !== 1 ? 's' : ''}  ·  ${themeName.value}`
})

const statusText = computed(() =>
  parseError.value ? `⚠ ${parseError.value.slice(0, 90)}` : '',
)
</script>

<template>
  <div id="header">
    <span class="logo">Dek<em>X</em></span>
    <span class="logo beta">BETA</span>
    <div class="vr"></div>
    <div class="file-actions">
      <button class="file-btn" @click="newFile">New</button>
      <button class="file-btn" @click="openFile">Open</button>
      <button class="file-btn" @click="saveFile">Save</button>
      <button class="file-btn" @click="saveFileAs">Save As</button>
    </div>
    <div class="vr"></div>
    <span v-if="isDirty" class="unsaved-dot" title="Unsaved changes"></span>
    <span id="deck-info">{{ deckInfo }}</span>
    <select
      class="theme-select"
      :value="themeName"
      @change="setTheme(($event.target as HTMLSelectElement).value)"
    >
      <option v-for="name in availableThemes" :key="name" :value="name">
        {{ name }}
      </option>
    </select>
    <div class="present-group">
      <button
        class="present-btn"
        :disabled="!canPresent"
        @click="startPresentation('presenter')"
      >
        Present
      </button>
      <div class="present-divider"></div>
      <button
        class="present-btn present-btn-arrow"
        :disabled="!canPresent"
        @click="showPresentMenu = !showPresentMenu"
      >
        <span class="arrow-down">&#x25BE;</span>
      </button>
      <div v-if="showPresentMenu" class="present-menu" @mouseleave="showPresentMenu = false">
        <button class="present-menu-item" @click="startPresentation('presenter'); showPresentMenu = false">
          Presenter view
          <span class="menu-desc">Opens audience in separate window</span>
        </button>
        <button class="present-menu-item" @click="startPresentation('single'); showPresentMenu = false">
          Single window
          <span class="menu-desc">Fullscreen in this window</span>
        </button>
      </div>
    </div>
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
  gap: 12px;
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

.beta {
  font-size: 11px;
  color: #7b6cf8;
  border: 1px solid #7b6cf8;
  padding: 2px 6px;
  border-radius: 4px;
}

.unsaved-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e0a040;
  flex-shrink: 0;
  margin-right: -8px;
}

.vr {
  width: 1px;
  height: 18px;
  background: rgba(255, 255, 255, 0.08);
}

.file-actions {
  display: flex;
  gap: 2px;
}

.file-btn {
  font-family: 'IBM Plex Sans', system-ui, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: #9898a8;
  background: transparent;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  transition: color 0.15s, background 0.15s;
}

.file-btn:hover {
  color: #ddd;
  background: rgba(255, 255, 255, 0.06);
}

#deck-info {
  font-size: 13px;
  color: #808090;
}

.theme-select {
  font-family: 'IBM Plex Sans', system-ui, sans-serif;
  font-size: 13px;
  color: #9898a8;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  outline: none;
}

.theme-select:hover,
.theme-select:focus {
  color: #ddd;
  border-color: rgba(255, 255, 255, 0.15);
}

.theme-select option {
  background: #1e1e28;
  color: #ddd;
}

.present-group {
  margin-left: auto;
  position: relative;
  display: flex;
  align-items: center;
}

.present-btn {
  font-family: 'IBM Plex Sans', system-ui, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  background: #7b6cf8;
  border: none;
  padding: 6px 16px;
  cursor: pointer;
  transition: background 0.15s;
  border-radius: 6px 0 0 6px;
}

.present-btn-arrow {
  border-radius: 0 6px 6px 0;
  padding: 6px 8px;
}

.present-divider {
  width: 1px;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
}

.present-btn:hover:not(:disabled) {
  background: #6b5ce8;
}

.present-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.arrow-down {
  font-size: 12px;
}

.present-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 6px;
  background: #1e1e28;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 4px;
  min-width: 220px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  z-index: 100;
}

.present-menu-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 100%;
  text-align: left;
  font-family: 'IBM Plex Sans', system-ui, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #ddd;
  background: transparent;
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background 0.12s;
}

.present-menu-item:hover {
  background: rgba(255, 255, 255, 0.08);
}

.menu-desc {
  font-size: 11px;
  font-weight: 400;
  color: #808090;
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
