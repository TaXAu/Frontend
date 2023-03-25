<script lang="ts" setup>
</script>

<template>
  <div
    class="ocr"
    flex="~"
    h="100vh"
    w="100vw"
  >
    <div
      class="nav"
      flex="none"
    >
      <OcrSideNav />
    </div>
    <div
      class="main"
      flex="auto"
      overflow="auto"
    >
      <OcrMain />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nav {
  width: $OcrSubNavWidth;
}
</style>
