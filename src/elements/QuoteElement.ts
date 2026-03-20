import { registerElement } from './registry'
import { esc, txt, hAttr } from '../utils/escape'

registerElement({
  tags: ['quote'],
  schema: {
    attributes: ['author', { name: 'h', values: ['left', 'center', 'right'] }],
  },

  render(el, ctx) {
    const t = ctx.theme
    const h = hAttr(el)
    const taStyle = h ? `text-align:${h};` : ''
    const author = el.getAttribute('author') || ''

    const inner = `
    <div style="display:flex;flex-direction:column;gap:20px;max-width:900px">
      <div style="font-size:110px;color:${t.accent};line-height:.38;font-family:Georgia,serif;opacity:.4">"</div>
      <div style="font-size:44px;font-weight:400;font-family:${t.hFont};line-height:1.5;color:${t.fg};font-style:italic">${esc(txt(el))}</div>
      ${author ? `<div style="font-size:22px;color:${t.fg2};letter-spacing:.01em">— ${esc(author)}</div>` : ''}
    </div>`

    return `<div style="${taStyle}display:flex;flex-direction:column;align-items:inherit">${inner}</div>`
  },
})
