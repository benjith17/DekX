import { registerElement } from './registry'
import { hAttr, vAttr, visibleChildren } from '../utils/escape'

registerElement({
  tags: ['flex'],

  render(el, ctx) {
    const t = ctx.theme
    const gap = el.getAttribute('gap') || '32'

    const h = hAttr(el)
    const v = vAttr(el)

    const jc =
      h === 'center' ? 'center' : h === 'right' ? 'flex-end' : 'flex-start'

    const ai =
      v === 'middle'
        ? 'center'
        : v === 'bottom'
          ? 'flex-end'
          : v === 'top'
            ? 'flex-start'
            : 'stretch'

    const flexStyle = `display:flex;gap:${gap}px;justify-content:${jc};align-items:${ai};`

    const colEls = [...el.querySelectorAll(':scope > col')]

    if (colEls.length) {
      const dividers = el.getAttribute('dividers') !== null
      const html = colEls
        .map((col, i) => {
          const w = parseFloat(col.getAttribute('weight') || '1')
          const colH = hAttr(col)
          const colV = vAttr(col)
          const colJC =
            colV === 'middle'
              ? 'justify-content:center;'
              : colV === 'bottom'
                ? 'justify-content:flex-end;'
                : ''
          const border =
            dividers && i < colEls.length - 1
              ? `border-right:1px solid ${t.border};padding-right:${gap}px;margin-right:-${Math.floor(parseInt(gap) / 2)}px;`
              : ''
          const taStyle = colH ? `text-align:${colH};` : ''
          const colKids = visibleChildren(col)
            .map((c) => ctx.renderElement(c))
            .join('')
          return `<div style="flex:${w};min-width:0;display:flex;flex-direction:column;gap:24px;${taStyle}${colJC}${border}">${colKids}</div>`
        })
        .join('')
      return `<div style="${flexStyle}">${html}</div>`
    }

    // No <col> children — each direct child becomes a flex:1 item.
    const directKids = visibleChildren(el)
    const html = directKids
      .map((c) => {
        const tag = c.tagName.toLowerCase()
        if (tag === 'stat') {
          return `<div style="flex:1;min-width:0;display:flex;flex-direction:column">${ctx.renderElement(c)}</div>`
        }
        return `<div style="flex:1;min-width:0">${ctx.renderElement(c)}</div>`
      })
      .join('')

    return `<div style="${flexStyle}">${html}</div>`
  },
})

// col is a no-op outside of flex — handled inline above
registerElement({
  tags: ['col'],
  render() {
    return ''
  },
})
