<template>
  <div class="rpa-flow">
    <div class="left">
      <FlowGallery />
    </div>
    <div class="center">
      <div class="flow-block" />
    </div>
    <div class="right" />
  </div>
</template>

<script lang="ts" setup>
</script>

<style lang="scss" scoped>
.rpa-flow {
  @apply h-100vh w-100vw;
  @apply flex;
}

.left, .center, .right {
  @apply w-full;
}
</style>
