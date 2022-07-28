<template>
  <div
    h="full"
    overflow="auto"
  >
    <OcrTopBar class="sticky" />
    <div
      class="main"
      p="x-4 b-2"
    >
      <div
        class="card"
      >
        <div class="title">
          项目基本信息
        </div>
        <hr>
        <div
          class="content prj-info"
          gap="x-4"
          grid="~ cols-2"
          leading="loose"
        >
          <p class="key">
            项目ID
          </p>
          <p class="id">
            {{ prjInfo?.id ?? '...' }}
          </p>
          <p class="key">
            项目名称
          </p>
          <p class="name">
            {{ prjInfo?.name ?? '...' }}
          </p>
          <p class="key">
            项目描述
          </p>
          <p class="description">
            {{ prjInfo?.description ?? '...' }}
          </p>
        </div>
      </div>
      <div class="card">
        <div class="title">
          OCR 配置
        </div>
        <hr>
        <div class="content" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref, watch} from 'vue';
import {getPrjInfo as _getPrjInfo} from '/@/plugins/prjDb';
import {stateStore} from '/@/stores/state';

defineProps({prjId: String});
const store = stateStore();
const prjInfo = ref();


function getPrjInfo() {
  if (store.ocr.prjId) {
    _getPrjInfo(store.ocr.prjId).then((info) => {
      if (info) {
        prjInfo.value = info;
      }
    });
  }
}

getPrjInfo();
watch(() => store.ocr.prjId, getPrjInfo);
</script>

<style lang="scss" scoped>
.card {
  @apply bg-light-400;
  @apply rounded-lg;
  @apply overflow-hidden;
  @apply px-10 py-5;
  @apply mb-2;
}

.main {
  height: calc(100% - $OcrTopBarHeight);
}

.prj-info {
  grid-template-columns: max-content auto;
}

.title {
  @apply leading-loose font-semibold text-xl tracking-wide;
}

.content {
  p {
    @apply text-sm
    @apply leading-loose
  }

  .id {
    @apply font-mono;
  }

  .key {
    @apply font-semibold;
  }
}

hr {
  @apply my-1 mx-0 h-1px border-none bg-gray-400;
}
</style>
