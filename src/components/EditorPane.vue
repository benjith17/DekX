<script setup lang="ts">
import { ref, onMounted, onUnmounted, shallowRef } from 'vue'
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
          fontSize: '13px',
        },
        '.cm-scroller': { overflow: 'auto' },
        '.cm-content': { lineHeight: '1.75' },
        '.cm-cursor': { borderLeftColor: '#7B6CF8' },
        '&.cm-focused .cm-selectionBackground, .cm-selectionBackground': {
          background: 'rgba(123,108,248,0.15) !important',
        },
        '.cm-gutters': {
          background: '#161616',
          borderRight: '1px solid #1e1e1e',
        },
        '.cm-lineNumbers .cm-gutterElement': {
          color: '#5a5a5a',
          fontSize: '11px',
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

onUnmounted(() => {
  clearTimeout(debounceTimer)
  view.value?.destroy()
})
</script>

<template>
  <div id="editor-pane">
    <div class="pane-label">XML Source</div>
    <div id="editor-wrap" ref="editorWrap"></div>
  </div>
</template>

<style scoped>
#editor-pane {
  width: 45%;
  flex-shrink: 0;
  border-right: 1px solid #1a1a1a;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

#editor-wrap {
  flex: 1;
  overflow: hidden;
}

.pane-label {
  height: 26px;
  background: #0f0f0f;
  border-bottom: 1px solid #1a1a1a;
  display: flex;
  align-items: center;
  padding: 0 14px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9.5px;
  color: #6b6b6b;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  flex-shrink: 0;
}
</style>
