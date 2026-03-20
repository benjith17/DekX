<script setup lang="ts">
import { computed } from 'vue'
import type { ThemeConfig } from '../types/theme'
import { createRenderContext } from '../composables/useParser'
import { hAttr, vAttr, visibleChildren, esc } from '../utils/escape'

const props = defineProps<{
  slideEl: Element
  theme: ThemeConfig
  index: number
  total: number
}>()

const resolvedTheme = computed<ThemeConfig>(() => ({
  ...props.theme,
  bg: props.slideEl.getAttribute('bg') || props.theme.bg,
  accent: props.slideEl.getAttribute('accent') || props.theme.accent,
}))

const slideHtml = computed(() => {
  const t = resolvedTheme.value
  const ctx = createRenderContext(t)
  return visibleChildren(props.slideEl)
    .map((c) => ctx.renderElement(c))
    .join('')
})

const textAlign = computed(() => hAttr(props.slideEl) || 'left')

const justifyContent = computed(() => {
  const v = vAttr(props.slideEl)
  if (v === 'bottom') return 'flex-end'
  if (v === 'middle') return 'center'
  return 'flex-start'
})

const numColor = computed(() =>
  resolvedTheme.value.isLight ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.12)',
)

const slideBadges = computed(() => {
  const el = props.slideEl
  const badges: string[] = []
  const h = hAttr(el)
  const v = vAttr(el)
  if (h) badges.push(`<span class="s-badge s-badge-align">h:${esc(h)}</span>`)
  if (v) badges.push(`<span class="s-badge s-badge-align">v:${esc(v)}</span>`)
  const tr = el.getAttribute('transition')
  if (tr) badges.push(`<span class="s-badge s-badge-trans">↳ ${esc(tr)}</span>`)
  return badges.join('')
})
</script>

<template>
  <div class="slide-wrapper">
    <div class="slide-meta">
      <span class="s-num">{{ String(index + 1).padStart(2, '0') }}</span>
      <span class="s-badge s-badge-dim">slide</span>
      <span v-html="slideBadges"></span>
    </div>
    <div class="slide-container">
      <div class="slide-scaler">
        <div
          class="slide-inner"
          :style="{
            background: resolvedTheme.bg,
            color: resolvedTheme.fg,
            fontFamily: resolvedTheme.bFont,
          }"
        >
          <div
            class="slide-content"
            :style="{
              textAlign,
              justifyContent,
            }"
            v-html="slideHtml"
          ></div>
          <div
            class="slide-page-num"
            :style="{
              color: numColor,
              fontFamily: resolvedTheme.hFont,
            }"
          >
            {{ index + 1 }} / {{ total }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slide-wrapper {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.slide-meta {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 0 3px;
  flex-wrap: wrap;
}

.s-num {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  color: #6b6b6b;
  min-width: 20px;
}

:deep(.s-badge) {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  padding: 1px 6px;
  border-radius: 2px;
  letter-spacing: 0.04em;
}

:deep(.s-badge-dim) {
  color: #6b6b6b;
  border: 1px solid #444;
}

:deep(.s-badge-align) {
  color: #4a7ca5;
  border: 1px solid rgba(74, 124, 165, 0.3);
}

:deep(.s-badge-trans) {
  color: #7b6cf8;
  border: 1px solid rgba(123, 108, 248, 0.3);
}

.slide-container {
  width: 100%;
  overflow: hidden;
  border-radius: 3px;
  box-shadow:
    0 2px 24px rgba(0, 0, 0, 0.55),
    0 0 0 1px rgba(255, 255, 255, 0.03);
}

.slide-scaler {
  width: 1280px;
  height: 720px;
  transform-origin: top left;
}

.slide-inner {
  width: 1280px;
  height: 720px;
  position: relative;
  overflow: hidden;
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
</style>
