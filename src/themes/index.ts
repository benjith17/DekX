import type { ThemeConfig } from '../types/theme'
import { dark } from './dark'
import { minimal } from './minimal'
import { corporate } from './corporate'
import { warm } from './warm'
import { bold } from './bold'

const themes: Record<string, ThemeConfig> = { dark, minimal, corporate, warm, bold }

export function getTheme(name: string): ThemeConfig {
  return themes[name] ?? themes.minimal
}

export function registerTheme(name: string, config: ThemeConfig): void {
  themes[name] = config
}

export function themeNames(): string[] {
  return Object.keys(themes)
}
