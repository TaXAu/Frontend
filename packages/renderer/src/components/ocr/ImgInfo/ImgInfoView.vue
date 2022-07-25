<template>
  <div
    flex="~ col"
    h="full"
  >
    <OcrTopBar flex="none" />
    <div
      class="main-img-info"
      flex="~ auto"
      gap="2"
      m="x-4 b-2"
    >
      <div basis="1/2">
        <ImgDisplay />
      </div>
      <div basis="1/2">
        <ImgInfoCard />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main-img-info {
  height: 100 vh- $OcrTopBarHeight;
}
</style>
