<script setup lang="ts">
import { ref, onMounted, onUnmounted, shallowRef, watch } from 'vue'
import { EditorState } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import { basicSetup } from 'codemirror'
import { xml } from '@codemirror/lang-xml'
import { oneDark } from '@codemirror/theme-one-dark'
import '../elements'
import { getElementSpecs } from '../elements/registry'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const editorWrap = ref<HTMLElement | null>(null)
const view = shallowRef<EditorView | null>(null)

let debounceTimer: ReturnType<typeof setTimeout> | undefined

onMounted(() => {
  if (!editorWrap.value) return

  const state = EditorState.create({
    doc: props.modelValue,
    extensions: [
      basicSetup,
      xml({ elements: getElementSpecs() }),
      oneDark,
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          clearTimeout(debounceTimer)
          debounceTimer = setTimeout(() => {
            emit('update:modelValue', update.state.doc.toString())
          }, 380)
        }
      }),
      EditorView.theme({
        '&': {
          height: '100%',
          fontFamily: "'IBM Plex Mono', Consolas, monospace",
          fontSize: '13.5px',
        },
        '.cm-scroller': {
          overflow: 'auto',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.1) transparent',
        },
        '.cm-scroller::-webkit-scrollbar': { width: '5px', height: '5px' },
        '.cm-scroller::-webkit-scrollbar-track': { background: 'transparent' },
        '.cm-scroller::-webkit-scrollbar-thumb': {
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '3px',
        },
        '.cm-scroller::-webkit-scrollbar-thumb:hover': {
          background: 'rgba(255,255,255,0.18)',
        },
        '.cm-content': { lineHeight: '1.7', padding: '8px 0' },
        '.cm-cursor': { borderLeftColor: '#7B6CF8' },
        '&.cm-focused .cm-selectionBackground, .cm-selectionBackground': {
          background: 'rgba(123,108,248,0.15) !important',
        },
        '.cm-gutters': {
          background: '#14141a',
          borderRight: '1px solid rgba(255,255,255,0.05)',
        },
        '.cm-lineNumbers .cm-gutterElement': {
          color: '#555566',
          fontSize: '12px',
        },
        '.cm-activeLine': {
          background: 'rgba(123,108,248,0.04)',
        },
        '.cm-activeLineGutter': {
          background: 'rgba(123,108,248,0.06)',
        },
      }),
      keymap.of([
        {
          key: 'Ctrl-Enter',
          run: () => {
            emit('update:modelValue', view.value!.state.doc.toString())
            return true
          },
        },
        {
          key: 'Cmd-Enter',
          run: () => {
            emit('update:modelValue', view.value!.state.doc.toString())
            return true
          },
        },
      ]),
    ],
  })

  view.value = new EditorView({
    state,
    parent: editorWrap.value,
  })
})

// Sync external content changes (e.g. file open) into the editor
watch(
  () => props.modelValue,
  (newVal) => {
    if (!view.value) return
    const current = view.value.state.doc.toString()
    if (newVal !== current) {
      view.value.dispatch({
        changes: { from: 0, to: current.length, insert: newVal },
      })
    }
  },
)

onUnmounted(() => {
  clearTimeout(debounceTimer)
  view.value?.destroy()
})
</script>

<template>
  <div id="editor-pane">
    <div class="pane-label">Source</div>
    <div id="editor-wrap" ref="editorWrap"></div>
  </div>
</template>

<style scoped>
#editor-pane {
  width: 45%;
  flex-shrink: 0;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

#editor-wrap {
  flex: 1;
  overflow: hidden;
}
</style>
