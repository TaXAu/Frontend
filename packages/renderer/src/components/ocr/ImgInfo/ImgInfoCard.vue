<template>
  <div
    bg="light-400"
    h="full"
    rounded="lg"
  >
    <div
      v-if="imgInfo!==undefined"
      class="info-grid"
      grid="~ cols-2"
      p="4"
    >
      <p>文件名</p>
      <p>{{ imgInfo?.filename }}</p>
      <p>图片id</p>
      <p>{{ imgInfo?.id }}</p>
      <p>项目id</p>
      <p>{{ imgInfo?.setId }}</p>
      <p>文件类型</p>
      <p>{{ imgInfo?.filetype }}</p>
      <p>文件路径</p>
      <p>{{ imgInfo?.path }}</p>
      <p>上传时间</p>
      <p>{{ imgInfo?.uploadTime.toLocaleString() }}</p>
      <p>修改时间</p>
      <p>{{ imgInfo?.lastModifiedTime.toLocaleString() }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {getImgInfo} from '/@/plugins/img';
import {stateStore} from '/@/stores/state';
import {computed, ref, watch} from 'vue';
import type {img as imgDBType} from '/@/plugins/indexDB';

const imgInfo = ref<imgDBType>();
const state = stateStore();
const imgId = computed(() => state.ocr.imgId);

watch(imgId, () => {
  if (state.isSelectImg) {
    getImgInfo(state.ocr.imgId).then(info => {
      imgInfo.value = info!;
    });
  }
});

</script>

<style lang="scss" scoped>
.info-grid {
  grid-template-columns: 4rem auto;
}

.info-grid {
  p {
    @apply text-sm text-black font-normal break-all leading-loose;
  }

  :nth-child(2n) {
    @apply font-mono

  }

  :nth-child(2n+1) {
    @apply font-semibold text-dark-200 select-none
  }
}

</style>
