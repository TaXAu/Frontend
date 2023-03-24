<script lang="ts" setup>
</script>

<template>
  <div
    class="img-top-bar"
    p="y-2 x-4"
    sticky="~"
    top="0"
    z="10"
  >
    <div
      bg="light-400"
      flex="~"
      gap="x-2"
      h="full"
      inset="x-0"
      items="center"
      p="x-4"
      rounded="lg"
      select="none"
      shadow="sm"
    >
      <OcrBreadCrumb />
      <div flex="auto" />
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.img-top-bar {
  height: $OcrTopBarHeight;
}
</style>
