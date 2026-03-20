import { registerElement } from './registry'
import { esc, txt, hAttr, isAccent } from '../utils/escape'

const HEADING_STYLES: Record<string, { size: number; weight: number; lineHeight: number; spacing: string }> = {
  h1: { size: 88, weight: 700, lineHeight: 1.05, spacing: '-.025em' },
  h2: { size: 56, weight: 700, lineHeight: 1.1, spacing: '-.015em' },
  h3: { size: 36, weight: 600, lineHeight: 1.25, spacing: '0' },
}

registerElement({
  tags: ['h1', 'h2', 'h3'],
  schema: {
    attributes: [{ name: 'h', values: ['left', 'center', 'right'] }, 'accent'],
  },

  render(el, ctx) {
    const tag = el.tagName.toLowerCase()
    const s = HEADING_STYLES[tag]
    const t = ctx.theme
    const h = hAttr(el)
    const taStyle = h ? `text-align:${h};` : ''
    const accentBar = isAccent(el)
      ? `border-bottom:2px solid ${t.accent};padding-bottom:20px;`
      : ''

    return `<div style="${taStyle}${accentBar}font-size:${s.size}px;font-weight:${s.weight};font-family:${t.hFont};line-height:${s.lineHeight};letter-spacing:${s.spacing};color:${t.fg}">${esc(txt(el))}</div>`
  },
})
