<template>
  <div
    class="img-top-bar"
    p="y-2 x-4"
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
      sticky="~"
      top="2"
      z="10"
    >
      <ChevronLeft
        class="transform"
        fill="hover:blue-600/80"
        scale="100"
      />
      <OcrBreadCrumb />
    </div>
  </div>
</template>

<script lang="ts" setup>
import ChevronLeft from '@material-design-icons/svg/round/chevron_left.svg';</script>

<style lang="scss" scoped>
.img-top-bar {
  height: $OcrTopBarHeight;
}
</style>
