<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useDeck } from '../composables/useDeck'
import { useScaler } from '../composables/useScaler'
import SlideInner from './SlideInner.vue'
import ParseError from './ParseError.vue'

const { parseError, theme, slides } = useDeck()

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
  background: #1a1a20;
}

#preview-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 24px 24px 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

#preview-scroll::-webkit-scrollbar {
  width: 5px;
}
#preview-scroll::-webkit-scrollbar-track {
  background: transparent;
}
#preview-scroll::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}
#preview-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.18);
}

.empty-msg {
  padding: 64px 24px;
  text-align: center;
  font-size: 14px;
  color: #808090;
}
</style>
