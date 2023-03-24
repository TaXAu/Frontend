<script lang="ts" setup>
import Delete from '@material-design-icons/svg/round/delete.svg'
import type { prjInfo } from '/@/utils/indexDB'
import { myImgDB as db } from '/@/utils/indexDB'
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ROUTE_NAME } from '/@/config'

const router = useRouter()

/* Get All Project Info */

const allPrjInfo = ref<Array<prjInfo>>([])

function getAllPrjInfo() {
  db.prj.toArray().then((res) => {
    allPrjInfo.value = res
  })
}

getAllPrjInfo()

/* Delete Project */
/* Del Mode */

const isDelMode = ref(false)
const toDelPrjIdSet = ref<Set<string>>(new Set())
const isPrjSelectedToDel = (id: string) => toDelPrjIdSet.value.has(id)

function changeDelMode() {
  if (isDelMode.value)
    cancelDelMode()
  else
    isDelMode.value = true
}

function cancelDelMode() {
  isDelMode.value = false
  toDelPrjIdSet.value = new Set()
}

function submitDelMode() {
  const toDelPrjIdArr = Array.from(toDelPrjIdSet.value)
  db.transaction('rw', db.img, db.prj, () => {
    db.prj.where('id').anyOf(toDelPrjIdArr).delete()
    db.img.where('prjId').anyOf(toDelPrjIdArr).delete()
  }).then(() => {
    getAllPrjInfo()
  }).catch((err) => {
    console.error(err)
  }).finally(() => {
    cancelDelMode()
  })
}

/* Add Project */
/* Normal Mode */

const isNormalMode = computed(() => !isDelMode.value)
const isShowDialog = ref(false)

function clickAddPrjButton() {
  isShowDialog.value = true
}

watch(isShowDialog, (val) => {
  if (!val)
    getAllPrjInfo()
})

/* Click Project Action */
/* Normal Mode: to Project Info Page */
/* Del Mode: selected image */
function clickPrj(id: string) {
  if (isNormalMode.value) {
    router.push({ name: ROUTE_NAME.OCR_PROJECT_CONFIG, params: { prjId: id } })
  }
  else if (isDelMode.value) {
    if (toDelPrjIdSet.value.has(id))
      toDelPrjIdSet.value.delete(id)
    else
      toDelPrjIdSet.value.add(id)
  }
}
</script>

<template>
  <OcrTopBar>
    <div
      :class="{ 'del-mode': isDelMode }"
      class="icon"
      @click="changeDelMode"
    >
      <Delete />
    </div>
  </OcrTopBar>
  <div
    class="img-sets-overview"
    grid="~ <sm:cols-1 sm:<md:cols-2 md:<lg:cols-3 lg:<2xl:cols-4 2xl:cols-5"
    p="4"
  >
    <div
      v-for="item in allPrjInfo"
      :key="item.id"
      class="img-set-item relative"
      :class="{ 'del-mode': isPrjSelectedToDel(item.id) }"
    >
      <div
        class="absolute"
        h="full"
        p="4"
        w="full"
      >
        <PrjCard
          class="prj-card"
          :description="item.description"
          :name="item.name"
          @click="clickPrj(item.id)"
        />
      </div>
    </div>
  </div>
  <div
    v-if="isNormalMode"
    bottom="10"
    class="float-buttons"
    fixed="~"
    flex="~ row"
    right="10"
    space="x-4"
    z="10"
  >
    <AddButton @click="clickAddPrjButton" />
  </div>
  <AddPrjDialog
    v-model:is-show="isShowDialog"
  />
  <div
    v-if="isDelMode"
    bottom="10"
    class="mode-popup del-mode"
  >
    <div
      class="bkg"
    >
      <p class="tip-text">
        删除模式
      </p>
      <div class="line-btn">
        <button @click="cancelDelMode">
          取消
        </button>
        <button @click="submitDelMode">
          删除
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.img-set-item {
  height: 0;
  padding-bottom: 50%;
}

.del-mode {

  &.icon {
    @apply bg-red-400 hover:bg-red-500;
  }

  svg {
    @apply fill-white;
  }

  &.mode-popup {
    .bkg {
      @apply bg-red-400;
    }
  }

  .prj-card {
    @apply ring ring-red-500 ring-offset-2 border-none;
  }
}
</style>
