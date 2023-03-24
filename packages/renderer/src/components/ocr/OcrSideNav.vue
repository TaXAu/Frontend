<script lang="ts" setup>
import { ref, watch } from 'vue'
import type { RouteRecordName } from 'vue-router'
import { useRoute, useRouter } from 'vue-router'
import { stateStore } from '/@/stores/state'
import type { ocrPageKeyType } from '/@/config'
import { ROUTE_NAME, ocrSubNavItem as data } from '/@/config'

const route = useRoute()
const router = useRouter()
const store = stateStore()
const curPage = ref<RouteRecordName>()
if (route.name)
  curPage.value = route.name

watch(() => route.name, (name) => {
  if (name)
    curPage.value = name
})

const isForbidden = (key: ocrPageKeyType) => !stateStore().isOcrSubNavItemEnabled(key)
const isChosen = (key: ocrPageKeyType) => key === curPage.value
const clickLinkButton = (key: ocrPageKeyType) => {
  switch (key) {
    case ROUTE_NAME.OCR_PROJECTS:
      router.push({ name: key })
      break

    case ROUTE_NAME.OCR_PROJECT_CONFIG:
    case ROUTE_NAME.OCR_PROJECT_DATA:
    case ROUTE_NAME.OCR_PROJECT_IMAGES:
      if (store.isInSet)
        router.push({ name: key, params: { prjId: store.ocr.prjId } })

      break

    case ROUTE_NAME.OCR_PROJECT_IMAGE_DETAIL:
      if (store.isSelectImg && store.isInSet)
        router.push({ name: key, params: { imgId: store.ocr.imgId } })

      break
  }
}
</script>

<template>
  <nav
    h="full"
  >
    <div
      bg="light-100"
      class="link-button-group"
      h="full"
      p="1"
    >
      <div
        v-for="item in data"
        :key="item.key"
        :class="{
          forbidden: isForbidden(item.key),
          chosen: isChosen(item.key),
        }"
        class="link-button highlight"
        font="medium"
        h="3rem"
        leading="3rem"
        m="2 first:t-1"
        rounded="2xl"
        select="none"
        text="center"
        @click="clickLinkButton(item.key)"
      >
        {{ item.name }}
      </div>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
.link-button-group {
  .highlight {
    @apply hover:bg-light-500;
  }

  .forbidden {
    @apply pointer-events-none;
    // forbid click
    @apply text-gray-400;
  }

  .chosen {
    @apply ring-2 ring-black ring-opacity-70
  }
}
</style>
