<script lang="ts" setup>
import { ref } from 'vue'
import { stateStore } from '/@/stores/state'

const state = stateStore()
const displayState = ref(0)

// signals
const recognizeMsg = ref(0)
const saveTableMsg = ref(0)

const updateRecoginzeMsgSignal = () => {
  recognizeMsg.value++
}
const updateSaveTableMsgSignal = () => {
  saveTableMsg.value++
}
</script>

<template>
  <div style="height: 100vh;">
    <OcrTopBar flex="none" />
    <div class="main px-4 pb-2">
      <div class="display flex">
        <div class="left flex-initial">
          <ImgDisplay />
        </div>
        <div class="divider flex-auto" />
        <div class="right flex-initial">
          <ImgInfoCard v-if="displayState === 0" />
          <OcrImgData v-if="displayState === 1" :recognize-msg="recognizeMsg" :save-msg="saveTableMsg" />
        </div>
      </div>
      <div class="toolbar mt-2 flex overflow-y-auto">
        <div v-if="displayState === 0">
          <button @click="displayState = 1">
            识别结果
          </button>
        </div>
        <div v-if="displayState === 1">
          <button class="!bg-blue-300 !hover:bg-blue-400" @click="updateRecoginzeMsgSignal()">
            表格识别
          </button>
          <button @click="updateSaveTableMsgSignal()">
            表格保存
          </button>
          <button @click="displayState = 0">
            图片信息
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main {
  height: calc(100vh - $OcrTopBarHeight);
}

.display {
  height: calc(100% - 3rem);
}

.left {
  width: 49%;
}

.right {
  width: 49%;
}

button {
  @apply bg-light-400 hover:bg-blue-300;
  @apply rounded-md border-none p-2 mr-2;
}
</style>
