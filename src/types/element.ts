import type { ThemeConfig } from './theme'

export interface RenderContext {
  theme: ThemeConfig
  renderElement: (el: Element) => string
  renderChildren: (parent: Element) => string
}

export interface ElementRenderer {
  tags: string[]
  render(el: Element, ctx: RenderContext): string
}
