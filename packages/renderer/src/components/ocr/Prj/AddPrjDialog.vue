<script lang="ts" setup>
import { ref } from 'vue'
import { addPrj } from '/@/utils/prjDb'

defineProps({ isShow: Boolean })
const emit = defineEmits(['update:isShow'])

const prjName = ref('')
const prjDescription = ref('')

const checkNameInput = () => {
  return true
}

const checkDescriptionInput = () => {
  return true
}

const clearForm = () => {
  prjName.value = ''
  prjDescription.value = ''
}

const submit = () => {
  if (checkNameInput() && checkDescriptionInput()) {
    addPrj(prjName.value, prjDescription.value)
    emit('update:isShow', false)
    clearForm()
  }
}

const cancel = () => {
  emit('update:isShow', false)
  clearForm()
}
</script>

<template>
  <MyDialog v-show="isShow">
    <template #header>
      <p pl="3">
        新建图片集
      </p>
    </template>

    <template #body>
      <div
        class="body-grid"
        grid="~ cols-2 rows-3 gap-y-1rem"
      >
        <p class="input-tip">
          名称：
        </p>
        <input
          v-model="prjName"
          class="input-area"
          type="text"
          @keyup="checkNameInput"
        >
        <p class="input-tip">
          描述：
        </p>
        <textarea
          v-model="prjDescription"
          class="input-area row-span-2"
          resize="none"
        />
      </div>
    </template>

    <template #footer>
      <div text="right">
        <button @click="cancel">
          取消
        </button>
        <button @click="submit">
          确定
        </button>
      </div>
    </template>
  </MyDialog>
</template>

<style lang="scss" scoped>
.body-grid {
  grid-template-columns: auto 14rem;
  grid-template-rows: 2rem 2rem 6rem;
}

.body-grid {
  p {
    @apply justify-self-start self-center
    @apply
  }
}

button {
  @apply mx-2 px-1rem py-0\.5rem
  @apply rounded-full
  @apply hover:bg-blue-100/50
  @apply font-medium text-blue-600
}

.input-tip {
  @apply text-gray-700/70 font-medium
}

.input-area {
  @apply px-8px py-4px
  @apply border-gray-500 outline-blue-500 rounded-lg
  @apply text-sm
}
</style>
