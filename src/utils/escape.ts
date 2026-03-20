export function esc(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function txt(el: Element | null): string {
  return el ? (el.textContent ?? '').trim() : ''
}

export function hAttr(el: Element): string | null {
  const v = el.getAttribute('h')
  return v === 'left' || v === 'center' || v === 'right' ? v : null
}

export function vAttr(el: Element): string | null {
  const v = el.getAttribute('v')
  return v === 'top' || v === 'middle' || v === 'bottom' ? v : null
}

export function isAccent(el: Element): boolean {
  return el.getAttribute('accent') !== null
}

const SKIP = new Set(['note', 'meta'])

export function isVisible(el: Element): boolean {
  return el.nodeType === 1 && !SKIP.has(el.tagName.toLowerCase())
}

export function visibleChildren(el: Element): Element[] {
  return [...el.children].filter(isVisible)
}
