<template>
  <div>
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
  </div>
</template>

<script lang="ts" setup>
import {stateStore} from '/@/stores/state';

const state = stateStore();
</script>

<style lang="scss" scoped>
</style>
