<template>
  <div
    v-if="state.isOcrImgSetOverviewPage"
    class="main-components"
  >
    <ImgSetView />
  </div>
  <div
    v-if="state.isOcrImgOverviewPage"
    class="main-components"
  >
    <ImgOverview />
  </div>
</template>

<script lang="ts" setup>
import {stateStore} from '/@/stores/state';

const state = stateStore();
</script>

<style lang="scss" scoped>
.main-components {
  @apply h-full
}
</style>
