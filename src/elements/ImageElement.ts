import { registerElement } from './registry'
import { esc } from '../utils/escape'

registerElement({
  tags: ['image'],

  render(el, ctx) {
    const t = ctx.theme
    const src = el.getAttribute('src') || ''
    const alt = el.getAttribute('alt') || ''
    const caption = el.getAttribute('caption') || ''

    return `
    <div style="display:flex;flex-direction:column;gap:14px">
      <img src="${esc(src)}" alt="${esc(alt)}" style="max-width:100%;max-height:400px;object-fit:contain;border-radius:8px">
      ${caption ? `<div style="font-size:20px;color:${t.fg2}">${esc(caption)}</div>` : ''}
    </div>`
  },
})
