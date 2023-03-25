<script lang="ts" setup>
import { computed, onActivated, onMounted, ref, watch } from 'vue'
import { stateStore } from '/@/stores/state'
import type { img } from '/@/utils/indexDB'
import { myImgDB as db } from '/@/utils/indexDB'
import { OCRClient } from '/@/utils/ocr'
import { notify } from '/@/components/common/notification'

const props = defineProps({
  recognizeMsg: Number,
  saveMsg: Number,
})
const state = stateStore()
const imgData = ref(null as img | null)
const client = ref(new OCRClient())

const updateData = async () => {
  const imgId = state.ocr.imgId

  if (imgId) {
    // eslint-disable-next-line no-console
    console.log('table image info', imgId)
    const result = (await db.getImg(imgId)) as img | void
    if (result)
      imgData.value = result
  }
}

onMounted(updateData)
onActivated(updateData)

client.value.test().then((res) => {
  if (res) {
    // eslint-disable-next-line no-console
    console.log('ocr client is ready')
    notify('OCR服务端连接成功', 'success')
  }
  else {
    // eslint-disable-next-line no-console
    console.log('ocr client is not ready')
    notify('OCR服务端连接失败', 'error')
  }
})

const ocrRecognize = async () => {
  await updateData()
  if (imgData.value?.dataUrl) {
    // eslint-disable-next-line no-console
    console.log('clickRecoginze')
    notify('开始识别', 'info')
    const imgBase64 = imgData.value!.dataUrl?.split(',')[1]
    const result = await client.value.recognize(imgBase64).catch((err) => {
      notify('识别失败', 'error')
      // eslint-disable-next-line no-console
      console.log(err)
    })
    if (result) {
      notify('识别成功', 'success')
      imgData.value!.result = JSON.stringify(result)
      await db.updateImg(imgData.value!)
    }
  }
}

watch(() => props.recognizeMsg, () => {
  // eslint-disable-next-line no-console
  console.log('Recognize Table', props.recognizeMsg)
  ocrRecognize()
})

const data = computed(() => {
  if (imgData.value?.result) {
    const result = JSON.parse(imgData.value.result)
    const data = result?.data
    if (data)
      return data
  }
  return null
})

const length = computed(() => {
  if (data.value)
    return Object.keys(data.value[0]).length - 1

  return 0
})

const save = async () => {
  if (imgData.value?.result) {
    const result = JSON.parse(imgData.value.result)
    result.data = data.value
    imgData.value.result = JSON.stringify(result)
    await db.updateImg(imgData.value)
  }
}

watch(() => props.saveMsg, () => {
  // eslint-disable-next-line no-console
  console.log('Save Table Data', props.saveMsg)
  save()
})
</script>

<template>
  <div class="bg-light-400 rounded-md h-full overflow-auto p-4">
    <div class="table overflow-auto">
      <vxe-table :data="data" :edit-config="{ trigger: 'click', mode: 'cell' }">
        <vxe-column
          v-for="i in length" :key="i" :edit-render="{ autofocus: '.my-input', autoselect: true }"
          :field="(i - 1).toString()" :title="i.toString()"
          width="100"
        >
          <template #edit="{ row }">
            <vxe-input v-model="row[(i - 1).toString()]" class="my-input" type="text" />
          </template>
        </vxe-column>
      </vxe-table>
    </div>
  </div>
</template>
