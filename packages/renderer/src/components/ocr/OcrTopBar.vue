<template>
  <div
    bg="light-400"
    class="img-top-bar"
    flex="~"
    gap="x-2"
    inset="x-0"
    items="center"
    m="y-2 x-4"
    p="x-4"
    rounded="lg"
    shadow="sm"
    select="none"
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
</template>

<script lang="ts" setup>
import ChevronLeft from '@material-design-icons/svg/round/chevron_left.svg';</script>

<style lang="scss" scoped>
.img-top-bar {
  height: $OcrTopBar;
}
</style>
