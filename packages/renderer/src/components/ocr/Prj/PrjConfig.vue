<template>
  <div
    h="full"
    overflow="auto"
  >
    <OcrTopBar>
      <div
        :class="{'edit-mode': isEditMode}"
        class="icon"
        @click="changeEditMode"
      >
        <Edit />
      </div>
    </OcrTopBar>
    <div
      class="main px-4"
    >
      <InfoCard
        header="项目基本信息"
        m="t-0"
      >
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
          <EditP
            v-model:text="editPrjName"
            :editable="isEditMode"
            class="name"
          />
          <p class="key">
            创建时间
          </p>
          <p>{{ prjInfo?.createdTime.toLocaleString() }}</p>
          <p class="key">
            修改时间
          </p>
          <p>{{ prjInfo?.lastModifiedTime.toLocaleString() }}</p>
          <p class="key">
            项目描述
          </p>
          <EditP
            v-model:text="editPrjDescription"
            :editable="isEditMode"
            class="description"
          />
        </div>
      </InfoCard>

      <InfoCard header="OCR配置" />
    </div>

    <!--    hover buttons-->
    <div
      class="float-buttons mode-popup"
    >
      <div
        v-if="isEditMode"
        class="edit-mode bkg"
      >
        <p
          class="tip-text"
        >
          编辑模式
        </p>
        <div
          class="line-btn"
        >
          <button @click="cancelEditMode">
            取消
          </button>
          <button @click="submitEdit">
            确定
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Edit from '@material-design-icons/svg/round/edit_note.svg';
import {onMounted, ref, watch} from 'vue';
import {updatePrj} from '/@/utils/prjDb';
import type {prjInfo as prjInfoType} from '/@/utils/indexDB';
import {stateStore} from '/@/stores/state';

defineProps({prjId: String});
const store = stateStore();
const prjInfo = ref<prjInfoType>();
const isEditMode = ref<boolean>(false);
const editPrjName = ref<string>('');
const editPrjDescription = ref<string>('');

// get current project info
function getPrjInfo() {
  if (store.ocr.prj) {
    prjInfo.value = store.ocr.prj;
    updateEditFromPrjInfo();
  }
}

function updatePrjInfoFromEdit() {
  if (prjInfo.value && editPrjName && editPrjDescription) {
    prjInfo.value.name = editPrjName.value;
    prjInfo.value.description = editPrjDescription.value;
    prjInfo.value.lastModifiedTime = new Date;
  }
}

function updateEditFromPrjInfo() {
  if (prjInfo.value && editPrjName && editPrjDescription) {
    editPrjName.value = prjInfo.value.name;
    editPrjDescription.value = prjInfo.value.description;
  }
}

onMounted(() => {
  getPrjInfo();
});
watch(() => store.ocr.prj, getPrjInfo);

/*
  Edit Logic
 */
function changeEditMode() {
  if (prjInfo.value) {
    if (!isEditMode.value) {
      isEditMode.value = true;
    } else {
      cancelEditMode();
    }
  } else {
    console.warn('no prj info');
    isEditMode.value = false;
  }
}

function cancelEditMode() {
  isEditMode.value = false;
  updateEditFromPrjInfo();
}

function submitEdit() {
  isEditMode.value = false;
  updatePrjInfoFromEdit();
  updatePrj(prjInfo.value!);
}
</script>

<style lang="scss" scoped>
.main {
  height: calc(100% - $OcrTopBarHeight);
}

.prj-info, .prj-config {
  grid-template-columns: max-content auto;
}

.content {
  p, select {
    @apply text-sm
    @apply leading-loose
    @apply px-1
  }

  .id {
    @apply font-mono;
  }

  .key {
    @apply font-semibold;
  }
}

.edit-mode {
  @apply bg-yellow-400;
  &.icon {
    @apply bg-yellow-400 hover:bg-yellow-500;
  }

  p {
    @apply light-300;
  }

  svg {
    @apply fill-gray-800/80;
  }
}
</style>
