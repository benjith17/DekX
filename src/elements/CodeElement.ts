import { registerElement } from './registry'
import { esc } from '../utils/escape'
import { dedent } from '../utils/dedent'

registerElement({
  tags: ['code'],

  render(el, ctx) {
    const t = ctx.theme
    const code = dedent(el.textContent ?? '')
    return `<div style="background:${t.codeBg};border-radius:10px;padding:40px 44px;font-family:'IBM Plex Mono',Consolas,monospace;font-size:22px;line-height:1.65;color:${t.codeFg};white-space:pre;text-align:left;border:1px solid ${t.border};flex:1;min-height:0;overflow:hidden">${esc(code)}</div>`
  },
})
