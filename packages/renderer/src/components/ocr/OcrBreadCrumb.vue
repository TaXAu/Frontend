<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { stateStore } from '/@/stores/state'
import { ROUTE_NAME } from '/@/config'
import { useRoute, useRouter } from 'vue-router'

const state = stateStore()
const route = useRoute()
const router = useRouter()
const isInPrj = computed(() =>
  route.name === ROUTE_NAME.OCR_PROJECT_IMAGES
  || route.name === ROUTE_NAME.OCR_PROJECT_CONFIG
  || route.name === ROUTE_NAME.OCR_PROJECT_DATA)
const isInImg = computed(() => route.name === ROUTE_NAME.OCR_PROJECT_IMAGE_DETAIL)
const DEFAULT_NAME = '...'
const SetName = ref(DEFAULT_NAME)
const ImgName = ref(DEFAULT_NAME)

const updateInfo = () => {
  if (state.ocr.img)
    ImgName.value = state.ocr.img.filename ?? DEFAULT_NAME
  if (state.ocr.prj)
    SetName.value = state.ocr.prj.name ?? DEFAULT_NAME
}

watch([
  () => state.ocr.img?.filename,
  () => state.ocr.prj?.name,
], () => {
  updateInfo()
})

onMounted(() => {
  updateInfo()
})
</script>

<template>
  <div
    flex="~"
    gap="1"
  >
    <p
      class="link-text"
      @click="router.push({ name: ROUTE_NAME.OCR_PROJECTS })"
    >
      项目
    </p>
    <p>/</p>
    <p
      v-show="isInPrj || isInImg"
      class="link-text"
      @click="router.push({
        name: ROUTE_NAME.OCR_PROJECT_CONFIG,
        params: { prjId: state.ocr.prjId },
      })"
    >
      {{ SetName }}
    </p>
    <p v-show="isInImg">
      /
    </p>
    <p
      v-show="isInImg"
      class="link-text"
      @click="router.push({
        name: ROUTE_NAME.OCR_PROJECT_IMAGES,
        params: { prjId: state.ocr.prjId },
      })"
    >
      {{ ImgName }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
p {
  @apply text-base font-semibold text-blue-600/80
  @apply align-middle
}

.link-text {
  @apply hover:underline
}
</style>
