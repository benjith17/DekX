export function dedent(str: string): string {
  const lines = str.split('\n')
  while (lines.length && !lines[0].trim()) lines.shift()
  while (lines.length && !lines[lines.length - 1].trim()) lines.pop()
  const min = Math.min(
    ...lines.filter((l) => l.trim()).map((l) => l.match(/^(\s*)/)![1].length),
  )
  return lines.map((l) => l.slice(min)).join('\n')
}
