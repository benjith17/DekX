import { registerElement } from './registry'
import { esc, txt, hAttr } from '../utils/escape'

registerElement({
  tags: ['p'],
  schema: {
    attributes: [{ name: 'h', values: ['left', 'center', 'right'] }],
  },

  render(el, ctx) {
    const h = hAttr(el)
    const taStyle = h ? `text-align:${h};` : ''
    return `<div style="${taStyle}font-size:26px;line-height:1.7;color:${ctx.theme.fg}">${esc(txt(el))}</div>`
  },
})
