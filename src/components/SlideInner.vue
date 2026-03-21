<script setup lang="ts">
import { computed } from 'vue'
import type { ThemeConfig } from '../types/theme'
import { hAttr, vAttr, esc } from '../utils/escape'
import { renderSlide } from '../utils/renderSlide'

const props = defineProps<{
  slideEl: Element
  theme: ThemeConfig
  index: number
  total: number
}>()

const rendered = computed(() => renderSlide(props.slideEl, props.theme))

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
      <!-- <span class="s-badge s-badge-dim">slide</span> -->
      <span v-html="slideBadges"></span>
    </div>
    <div class="slide-container">
      <div class="slide-scaler">
        <div
          class="slide-inner"
          :style="{
            background: rendered.theme.bg,
            color: rendered.theme.fg,
            fontFamily: rendered.theme.bFont,
          }"
        >
          <div
            class="slide-content"
            :style="{
              textAlign: rendered.layout.textAlign,
              justifyContent: rendered.layout.justifyContent,
              alignItems: rendered.layout.alignItems,
            }"
            v-html="rendered.html"
          ></div>
          <div
            class="slide-page-num"
            :style="{
              color: rendered.numColor,
              fontFamily: rendered.theme.hFont,
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
  gap: 8px;
}

.slide-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 4px;
  flex-wrap: wrap;
}

.s-num {
  font-size: 13px;
  font-weight: 500;
  color: #808090;
  min-width: 22px;
}

:deep(.s-badge) {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  margin: 2px;
}

:deep(.s-badge-dim) {
  color: #808090;
  background: rgba(255, 255, 255, 0.04);
}

:deep(.s-badge-align) {
  color: #7baed4;
  background: rgba(123, 174, 212, 0.08);
}

:deep(.s-badge-trans) {
  color: #9b8fff;
  background: rgba(123, 108, 248, 0.1);
}

.slide-container {
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
  box-shadow:
    0 4px 32px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.04);
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
