import type { ElementRenderer, RenderContext } from '../types/element'

const renderers = new Map<string, ElementRenderer>()
const SKIP = new Set(['note', 'meta'])

export function registerElement(renderer: ElementRenderer): void {
  for (const tag of renderer.tags) {
    renderers.set(tag.toLowerCase(), renderer)
  }
}

export function renderElement(el: Element, ctx: RenderContext): string {
  if (!el || el.nodeType !== 1) return ''
  const tag = el.tagName.toLowerCase()
  if (SKIP.has(tag)) return ''

  const renderer = renderers.get(tag)
  if (!renderer) return ''
  return renderer.render(el, ctx)
}

export function hasRenderer(tag: string): boolean {
  return renderers.has(tag.toLowerCase())
}
