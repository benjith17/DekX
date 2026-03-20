import { registerElement } from './registry'
import { esc } from '../utils/escape'

function renderStatCard(el: Element, t: import('../types/theme').ThemeConfig): string {
  const value = el.getAttribute('value') || ''
  const label = el.getAttribute('label') || ''
  const trend = el.getAttribute('trend') || ''
  const trendMap: Record<string, [string, string]> = {
    up: ['↑', '#4ade80'],
    down: ['↓', '#f87171'],
    flat: ['→', t.fg2],
  }
  const entry = trendMap[trend]
  const icon = entry?.[0]
  const color = entry?.[1]

  return `
    <div style="background:${t.statBg};border-radius:14px;padding:44px 40px;display:flex;flex-direction:column;gap:14px;border:1px solid ${t.border};height:100%">
      <div style="font-size:20px;color:${t.fg2};letter-spacing:.02em">${esc(label)}</div>
      <div style="font-size:88px;font-weight:700;font-family:${t.hFont};line-height:1;letter-spacing:-.03em;color:${t.fg}">${esc(value)}</div>
      ${icon ? `<div style="font-size:24px;color:${color};font-weight:500;margin-top:4px">${icon} ${esc(trend)}</div>` : ''}
    </div>`
}

registerElement({
  tags: ['stat'],
  schema: {
    attributes: [
      'value',
      'label',
      { name: 'trend', values: ['up', 'down', 'flat'] },
    ],
    selfClosing: true,
  },

  render(el, ctx) {
    return renderStatCard(el, ctx.theme)
  },
})

registerElement({
  tags: ['stats'],
  schema: {
    children: ['stat'],
  },

  render(el, ctx) {
    const statEls = [...el.querySelectorAll('stat')]
    const cards = statEls
      .map(
        (s) =>
          `<div style="flex:1;min-width:0;display:flex;flex-direction:column">${renderStatCard(s, ctx.theme)}</div>`,
      )
      .join('')
    return `<div style="display:flex;gap:24px;align-items:stretch">${cards}</div>`
  },
})
