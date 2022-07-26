<template>
  <div
    h="full"
  >
    <OcrTopBar flex="none" />
    <div
      class="main-img-info"
      grid="~ cols-2"
      gap="2"
      m="x-4"
      p="b-2"
    >
      <div overflow="hidden">
        <ImgDisplay />
      </div>
      <div>
        <ImgInfoCard />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main-img-info {
  height: calc(100% - $OcrTopBarHeight);
}
</style>
