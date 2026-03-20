<script setup lang="ts">
defineProps<{ message: string }>()
</script>

<template>
  <div class="parse-error">{{ message }}</div>
</template>

<style scoped>
.parse-error {
  background: rgba(224, 108, 117, 0.06);
  border: 1px solid rgba(224, 108, 117, 0.15);
  border-radius: 8px;
  padding: 20px 24px;
  color: #e8838b;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  white-space: pre-wrap;
  line-height: 1.65;
}
</style>
