<template>
  <div
    h="full"
    overflow="auto"
  >
    <OcrTopBar>
      <div
        :class="{'edit-mode': isEditMode}"
        bg="hover:light-700"
        class="icon"
        rounded="lg"
        @click="changeEditMode"
      >
        <Edit />
      </div>
    </OcrTopBar>
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
      </div>
      <div class="card">
        <div class="title">
          OCR 配置
        </div>
        <hr>
        <div class="content" />
      </div>
    </div>
    <!--    hover buttons-->
    <div
      bottom="5"
      class="float-buttons"
      fixed="~"
      right="5"
      select="none"
      z="10"
    >
      <div
        v-if="isEditMode"
        class="edit-mode"
        p="x-4 y-2"
        rounded="lg"
        shadow="lg"
      >
        <p
          leading="loose"
          text="xl center"
        >
          编辑模式
        </p>
        <div
          text="center"
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
import {getPrjInfo as _getPrjInfo, updatePrj} from '/@/utils/prjDb';
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
  if (store.ocr.prjId) {
    _getPrjInfo(store.ocr.prjId).then((info) => {
      if (info) {
        prjInfo.value = info;
        updateEditFromPrjInfo();
      }
    });
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
watch(() => store.ocr.prjId, getPrjInfo);

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

  p {
    @apply px-1
  }
}

hr {
  @apply my-1 mx-0 h-1px border-none bg-gray-400;
}

// top bar icon style
.icon {
  height: $OcrTopBarHeight - 2rem;
  width: $OcrTopBarHeight - 2rem;
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

  button {
    @apply hover:bg-light-400/40;
    @apply light-300;
    @apply mx-1 px-3 py-0.5 rounded-full;
  }
}
</style>
