<script setup lang="ts">
import { useDeck } from './composables/useDeck'
import { usePresentation } from './composables/usePresentation'
import AppHeader from './components/AppHeader.vue'
import EditorPane from './components/EditorPane.vue'
import PreviewPane from './components/PreviewPane.vue'
import PresentationView from './components/PresentationView.vue'

const { xmlSource } = useDeck()
const { isPresenting } = usePresentation()
</script>

<template>
  <div id="app-root">
    <AppHeader />
    <div id="body">
      <EditorPane v-model="xmlSource" />
      <PreviewPane />
    </div>
    <PresentationView v-if="isPresenting" />
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
