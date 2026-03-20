import type { ThemeConfig } from './theme'

export interface RenderContext {
  theme: ThemeConfig
  renderElement: (el: Element) => string
  renderChildren: (parent: Element) => string
}

export interface ElementSchema {
  attributes?: readonly (string | { name: string; values?: readonly string[] })[]
  children?: readonly string[]
  selfClosing?: boolean
}

export interface ElementRenderer {
  tags: string[]
  schema?: ElementSchema
  render(el: Element, ctx: RenderContext): string
}
