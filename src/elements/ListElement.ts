import { registerElement } from './registry'
import { esc, txt } from '../utils/escape'

registerElement({
  tags: ['ul'],

  render(el, ctx) {
    const t = ctx.theme
    const type = el.getAttribute('type') || 'bullet'
    const items = [...el.querySelectorAll('li, item')]
    if (!items.length) return ''

    const rows = items
      .map((item, i) => {
        let marker: string
        if (type === 'number') {
          marker = `<span style="color:${t.accent};font-size:28px;font-weight:600;min-width:44px;flex-shrink:0;text-align:right;padding-right:6px;font-family:${t.hFont}">${i + 1}.</span>`
        } else if (type === 'check') {
          marker = `<span style="color:${t.accent};font-size:24px;min-width:44px;flex-shrink:0;text-align:center">✓</span>`
        } else {
          marker = `<span style="color:${t.accent};font-size:9px;min-width:44px;flex-shrink:0;text-align:center;padding-top:12px">●</span>`
        }
        return `<div style="display:flex;align-items:baseline;line-height:1.45;text-align:left">
      ${marker}<span style="font-size:28px">${esc(txt(item))}</span>
    </div>`
      })
      .join('')

    return `<div style="display:flex;flex-direction:column;gap:22px;text-align:left">${rows}</div>`
  },
})
