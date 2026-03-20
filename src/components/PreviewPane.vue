<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useDeck } from '../composables/useDeck'
import { useScaler } from '../composables/useScaler'
import SlideInner from './SlideInner.vue'
import ParseError from './ParseError.vue'

const { parseError, theme, slides, metaTitle, themeName } = useDeck()

const previewScroll = ref<HTMLElement | null>(null)
const { scaleAll } = useScaler(previewScroll)

watch(
  slides,
  async () => {
    await nextTick()
    scaleAll()
  },
  { flush: 'post' },
)
</script>

<template>
  <div id="preview-pane">
    <div class="pane-label">Preview</div>
    <div id="preview-scroll" ref="previewScroll">
      <ParseError v-if="parseError" :message="parseError" />
      <div
        v-else-if="!slides.length"
        class="empty-msg"
      >
        No &lt;slide&gt; elements found
      </div>
      <template v-else>
        <SlideInner
          v-for="(slide, i) in slides"
          :key="i"
          :slideEl="slide"
          :theme="theme"
          :index="i"
          :total="slides.length"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
#preview-pane {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #141414;
}

#preview-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 18px 20px 32px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

#preview-scroll::-webkit-scrollbar {
  width: 4px;
}
#preview-scroll::-webkit-scrollbar-track {
  background: transparent;
}
#preview-scroll::-webkit-scrollbar-thumb {
  background: #3a3a3a;
  border-radius: 2px;
}
#preview-scroll::-webkit-scrollbar-thumb:hover {
  background: #333;
}

.empty-msg {
  padding: 48px 20px;
  text-align: center;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  color: #6b6b6b;
}
</style>
