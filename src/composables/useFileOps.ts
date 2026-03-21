import { ref, shallowRef, computed, onMounted, onUnmounted } from 'vue'
import { useDeck } from './useDeck'
import { useToast } from './useToast'
import DEFAULT_XML from '../defaults/sample-deck.xml?raw'

const currentFileName = ref<string | null>(null)
const fileHandle = shallowRef<FileSystemFileHandle | null>(null)
const lastSavedContent = ref<string>(DEFAULT_XML)

const { xmlSource } = useDeck()
const { show: showToast } = useToast()

const isDirty = computed(() => xmlSource.value !== lastSavedContent.value)

const supportsFileSystem =
  typeof window !== 'undefined' && 'showSaveFilePicker' in window

const dekxFileTypes = [
  {
    description: 'DekX Deck',
    accept: { 'application/xml': ['.dekx'] },
  },
]

async function saveFileAs(): Promise<void> {
  const content = xmlSource.value

  if (supportsFileSystem) {
    try {
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: currentFileName.value || 'untitled.dekx',
        types: dekxFileTypes,
      })
      const writable = await handle.createWritable()
      await writable.write(content)
      await writable.close()
      fileHandle.value = handle
      currentFileName.value = handle.name
      lastSavedContent.value = content
      showToast(`Saved ${handle.name}`)
    } catch (e: unknown) {
      if (e instanceof DOMException && e.name === 'AbortError') return
      throw e
    }
  } else {
    const blob = new Blob([content], { type: 'application/xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = currentFileName.value || 'untitled.dekx'
    a.click()
    URL.revokeObjectURL(url)
    lastSavedContent.value = content
    showToast('File downloaded')
  }
}

async function saveFile(): Promise<void> {
  if (!fileHandle.value || !supportsFileSystem) {
    return saveFileAs()
  }

  const content = xmlSource.value
  const writable = await fileHandle.value.createWritable()
  await writable.write(content)
  await writable.close()
  lastSavedContent.value = content
  showToast(`Saved ${currentFileName.value}`)
}

async function openFile(): Promise<void> {
  if (supportsFileSystem) {
    try {
      const [handle] = await (window as any).showOpenFilePicker({
        types: dekxFileTypes,
        multiple: false,
      })
      const file = await handle.getFile()
      const text = await file.text()
      xmlSource.value = text
      fileHandle.value = handle
      currentFileName.value = handle.name
      lastSavedContent.value = text
    } catch (e: unknown) {
      if (e instanceof DOMException && e.name === 'AbortError') return
      throw e
    }
  } else {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.dekx,.xml'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      const text = await file.text()
      xmlSource.value = text
      fileHandle.value = null
      currentFileName.value = file.name
      lastSavedContent.value = text
    }
    input.click()
  }
}

function newFile(): void {
  xmlSource.value = DEFAULT_XML
  fileHandle.value = null
  currentFileName.value = null
  lastSavedContent.value = DEFAULT_XML
}

// beforeunload guard — warns if there are unsaved changes
function onBeforeUnload(e: BeforeUnloadEvent) {
  if (isDirty.value) {
    e.preventDefault()
  }
}

function installBeforeUnload() {
  window.addEventListener('beforeunload', onBeforeUnload)
}

function removeBeforeUnload() {
  window.removeEventListener('beforeunload', onBeforeUnload)
}

export function useFileOps() {
  return {
    currentFileName,
    isDirty,
    saveFile,
    saveFileAs,
    openFile,
    newFile,
    installBeforeUnload,
    removeBeforeUnload,
  }
}
