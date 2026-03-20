import { registerElement } from './registry'
import { esc, txt, hAttr } from '../utils/escape'

registerElement({
  tags: ['subtitle'],

  render(el, ctx) {
    const h = hAttr(el)
    const taStyle = h ? `text-align:${h};` : ''
    return `<div style="${taStyle}font-size:28px;color:${ctx.theme.fg2};line-height:1.5">${esc(txt(el))}</div>`
  },
})
