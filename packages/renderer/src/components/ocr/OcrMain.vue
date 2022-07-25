<template>
  <div
    v-if="state.isInPage('prj-overview')"
    class="main-components"
  >
    <ImgSetView />
  </div>
  <div
    v-if="state.isInPage('img-overview')"
    class="main-components"
  >
    <ImgOverview />
  </div>
  <div
    v-if="state.isInPage('img-info')"
    class="main-components"
  >
    <ImgInfoView />
  </div>
</template>

<script lang="ts" setup>
import {stateStore} from '/@/stores/state';
import ImgInfoView from '/@/components/ocr/ImgInfo/ImgInfoView.vue';

const state = stateStore();
</script>

<style lang="scss" scoped>
.main-components {
  @apply h-full;
}
</style>
