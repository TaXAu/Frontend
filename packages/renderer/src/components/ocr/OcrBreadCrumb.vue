<template>
  <div
    flex="~"
    gap="1"
  >
    <p
      class="link-text"
      @click="state.changeOcrPage('prj-overview')"
    >
      项目
    </p>
    <p>/</p>
    <p
      v-show="isInSet || isInImg"
      class="link-text"
      @click="state.changeOcrPage('img-overview')"
    >
      {{ SetName }}
    </p>
    <p v-show="isInImg">
      /
    </p>
    <p
      v-show="isInImg"
      class="link-text"
      @click="state.changeOcrPage('img-info')"
    >
      {{ ImgName }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref, watch} from 'vue';
import {stateStore} from '/@/stores/state';
import {getImgInfo, getImgSetInfo} from '/@/plugins/img';

const state = stateStore();
const isInSet = computed(() => state.ocr.nowPage === 'img-overview');
const isInImg = computed(() => state.ocr.nowPage === 'img-info');
const DEFAULT_NAME = '...';
const SetName = ref(DEFAULT_NAME);
const ImgName = ref(DEFAULT_NAME);

watch([isInImg, isInSet], () => {
  if (isInImg.value) {
    getImgInfo(state.ocr.imgId).then((imgInfo) => {
      ImgName.value = imgInfo?.filename ?? DEFAULT_NAME;
    });
  }
  if (isInSet.value) {
    getImgSetInfo(state.ocr.setId).then((imgSetInfo) => {
      SetName.value = imgSetInfo?.name ?? DEFAULT_NAME;
    });
  }
});
</script>

<style>
p {
  @apply text-base font-semibold text-blue-600/80
  @apply align-middle
}

.link-text {
  @apply hover:underline
}
</style>
