import { registerElement } from './registry'

registerElement({
  tags: ['divider'],
  schema: { selfClosing: true },

  render(_el, ctx) {
    return `<div style="height:1px;background:${ctx.theme.border};flex-shrink:0;align-self:stretch"></div>`
  },
})
