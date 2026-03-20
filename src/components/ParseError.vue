<script setup lang="ts">
defineProps<{ message: string }>()
</script>

<template>
  <div class="parse-error">{{ message }}</div>
</template>

<style scoped>
.parse-error {
  background: rgba(224, 108, 117, 0.07);
  border: 1px solid rgba(224, 108, 117, 0.2);
  border-radius: 3px;
  padding: 18px 20px;
  color: #e06c75;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  white-space: pre-wrap;
  line-height: 1.65;
}
</style>
