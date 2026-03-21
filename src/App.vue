<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useDeck } from './composables/useDeck'
import { usePresentation } from './composables/usePresentation'
import { useFileOps } from './composables/useFileOps'
import AppHeader from './components/AppHeader.vue'
import EditorPane from './components/EditorPane.vue'
import PreviewPane from './components/PreviewPane.vue'
import PresentationView from './components/PresentationView.vue'
import ToastContainer from './components/ToastContainer.vue'

const { xmlSource } = useDeck()
const { isPresenting } = usePresentation()
const { installBeforeUnload, removeBeforeUnload } = useFileOps()

onMounted(installBeforeUnload)
onUnmounted(removeBeforeUnload)
</script>

<template>
  <div id="app-root">
    <AppHeader />
    <div id="body">
      <EditorPane v-model="xmlSource" />
      <PreviewPane />
    </div>
    <PresentationView v-if="isPresenting" />
    <ToastContainer />
  </div>
</template>

<style scoped>
#app-root {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

#body {
  display: flex;
  flex: 1;
  overflow: hidden;
}
</style>
