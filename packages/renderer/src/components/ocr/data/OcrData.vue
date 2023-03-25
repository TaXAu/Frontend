<script lang="ts" setup>
import type { Ref } from 'vue'
import { onActivated, ref } from 'vue'
import type { img } from '/@/utils/indexDB'
import { myImgDB as db } from '/@/utils/indexDB'
import { stateStore } from '/@/stores/state'

const refreshRef = ref(false)
const state = stateStore()
const imgData = ref([]) as Ref<Array<img>>

onActivated(async () => {
  const prjId = state.ocr.prjId
  if (prjId) {
    const result = await db.getAllImg(prjId)
    if (result)
      imgData.value = result

    // eslint-disable-next-line no-console
    console.log('table image info', result)
  }
})

const refresh = () => {
  refreshRef.value = !refreshRef.value
}
</script>

<template>
  <div ref="refreshRef" class="main w-full h-full flex flex-col px-2">
    <div class="toolbar flex-initial">
      <vxe-toolbar>
        <template #buttons>
          <vxe-button @click="refresh()">
            刷新
          </vxe-button>
        </template>
      </vxe-toolbar>
    </div>
    <div class="overflow-auto flex-auto h-full w-full">
      <vxe-table
        :data="imgData" border height="auto" round
      >
        <vxe-column field="filename" min-width="300" title="文件名" />
        <vxe-column field="id" min-width="300" title="ID" />
        <vxe-column field="uploadTime" min-width="300" title="上传时间" />
        <vxe-column field="lastModifiedTime" min-width="300" title="最后修改时间" />
        <vxe-column field="path" min-width="300" title="路径" />
      </vxe-table>
    </div>
  </div>
</template>

<style lang="scss">
</style>
