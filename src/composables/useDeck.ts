import { ref, computed } from 'vue'
import { getTheme } from '../themes'
import { txt } from '../utils/escape'
import type { ThemeConfig } from '../types/theme'
import DEFAULT_XML from '../defaults/sample-deck.xml?raw'

const xmlSource = ref<string>(DEFAULT_XML)
const parseError = ref<string | null>(null)

const parsedDoc = computed(() => {
  try {
    const doc = new DOMParser().parseFromString(xmlSource.value, 'application/xml')
    const err = doc.querySelector('parsererror')
    if (err) {
      parseError.value =
        err.textContent?.split('\n').slice(0, 3).join(' ').trim() ?? 'Parse error'
      return null
    }
    parseError.value = null
    return doc
  } catch (e: unknown) {
    parseError.value = e instanceof Error ? e.message : 'Unknown parse error'
    return null
  }
})

const deck = computed(() => parsedDoc.value?.querySelector('deck') ?? null)

const themeName = computed(() => deck.value?.getAttribute('theme') ?? 'minimal')

const theme = computed<ThemeConfig>(() => getTheme(themeName.value))

const slides = computed(() =>
  deck.value ? [...deck.value.querySelectorAll(':scope > slide')] : [],
)

const metaTitle = computed(() => txt(deck.value?.querySelector('meta > title') ?? null))

export function useDeck() {
  return {
    xmlSource,
    parseError,
    deck,
    themeName,
    theme,
    slides,
    metaTitle,
  }
}
