import type { ElementRenderer, RenderContext } from '../types/element'
import type { ElementSpec, AttrSpec } from '@codemirror/lang-xml'
import { themeNames } from '../themes'

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

/** Build CodeMirror-compatible ElementSpec[] from registry + structural elements. */
export function getElementSpecs(): readonly ElementSpec[] {
  // Collect all registered tag names for use as slide children
  const allTags = [...renderers.keys()]

  // Convert registry schemas to ElementSpec
  const fromRegistry: ElementSpec[] = []
  const seen = new Set<string>()

  for (const [tag, renderer] of renderers) {
    if (seen.has(tag)) continue
    seen.add(tag)

    const attrs: (string | AttrSpec)[] = []
    const children: string[] = []

    if (renderer.schema) {
      if (renderer.schema.attributes) {
        for (const a of renderer.schema.attributes) {
          if (typeof a === 'string') {
            attrs.push(a)
          } else {
            attrs.push({ name: a.name, values: a.values ? [...a.values] : undefined })
          }
        }
      }
      if (renderer.schema.children) {
        children.push(...renderer.schema.children)
      }
    }

    fromRegistry.push({
      name: tag,
      attributes: attrs.length ? attrs : undefined,
      children: children.length ? children : undefined,
    })
  }

  // Structural elements not in the registry
  const structural: ElementSpec[] = [
    {
      name: 'deck',
      top: true,
      children: ['meta', 'slide'],
      attributes: [{ name: 'theme', values: themeNames() }],
    },
    {
      name: 'slide',
      children: allTags.filter((t) => t !== 'col'),
      attributes: [
        { name: 'h', values: ['left', 'center', 'right'] },
        { name: 'v', values: ['top', 'middle', 'bottom'] },
        { name: 'transition', values: ['fade', 'slide', 'none'] },
        'bg',
        'accent',
      ],
    },
    {
      name: 'meta',
      children: ['title', 'author'],
    },
    { name: 'title' },
    { name: 'author' },
    { name: 'li' },
    { name: 'item' },
  ]

  return [...structural, ...fromRegistry]
}
