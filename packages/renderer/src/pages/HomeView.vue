<script lang="ts" setup>
import { router } from '/@/router'

const startOCR = () => {
  router.push('/ocr')
}

const startRPA = () => {
  router.push('/rpa')
}
</script>

<template>
  <div class="h-full w-full py-30">
    <a @click="startOCR">Start OCR →</a>
    <a @click="startRPA">Start RPA →</a>
  </div>
</template>

<style lang="scss">
a {
  display: block;
  @apply text-center font-bold cursor-pointer shadow-md;
  @apply mx-auto my-4 py-6 px-8  w-80;
  @apply bg-light-600 hover:bg-blue-400 text-white rounded-xl;
}
</style>
