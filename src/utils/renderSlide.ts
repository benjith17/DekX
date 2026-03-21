import type { ThemeConfig } from '../types/theme'
import { createRenderContext } from '../composables/useParser'
import { hAttr, vAttr, visibleChildren } from './escape'

export interface SlideLayout {
  textAlign: 'left' | 'center' | 'right'
  justifyContent: string
  alignItems: string
}

export interface RenderedSlide {
  html: string
  theme: ThemeConfig
  layout: SlideLayout
  numColor: string
}

export function renderSlide(
  slideEl: Element,
  baseTheme: ThemeConfig,
): RenderedSlide {
  const theme: ThemeConfig = {
    ...baseTheme,
    bg: slideEl.getAttribute('bg') || baseTheme.bg,
    accent: slideEl.getAttribute('accent') || baseTheme.accent,
  }

  const ctx = createRenderContext(theme)
  const html = visibleChildren(slideEl)
    .map((c) => ctx.renderElement(c))
    .join('')

  const h = hAttr(slideEl)
  const v = vAttr(slideEl)

  const textAlign: SlideLayout['textAlign'] = h || 'left'
  const alignItems =
    h === 'center' ? 'center' : h === 'right' ? 'flex-end' : 'stretch'
  const justifyContent =
    v === 'bottom' ? 'flex-end' : v === 'middle' ? 'center' : 'flex-start'

  const numColor = theme.isLight
    ? 'rgba(0,0,0,0.18)'
    : 'rgba(255,255,255,0.12)'

  return { html, theme, layout: { textAlign, justifyContent, alignItems }, numColor }
}
