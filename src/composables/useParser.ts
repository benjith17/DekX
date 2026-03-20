import type { ThemeConfig } from '../types/theme'
import type { RenderContext } from '../types/element'
import { renderElement } from '../elements/registry'
import { isVisible } from '../utils/escape'

// Ensure all elements are registered
import '../elements'

export function createRenderContext(theme: ThemeConfig): RenderContext {
  const ctx: RenderContext = {
    theme,
    renderElement: (el: Element) => renderElement(el, ctx),
    renderChildren: (parent: Element) =>
      [...parent.children]
        .filter(isVisible)
        .map((c) => renderElement(c, ctx))
        .join(''),
  }
  return ctx
}
