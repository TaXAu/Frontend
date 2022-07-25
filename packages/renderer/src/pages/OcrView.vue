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

<script lang="ts" setup>
</script>

<style lang="scss" scoped>
.nav {
  width: $OcrSubNavWidth;
}
</style>
