<template>
  <OcrTopBar />
  <div
    ref="imgSetDiv"
    class="img-sets-overview"
    grid="~ <sm:cols-1 sm:<md:cols-2 md:<lg:cols-3 lg:<2xl:cols-4 2xl:cols-5"
    p="4"
  >
    <div
      v-for="item in allImgSetInfo"
      ref="clickOutsideRef"
      :key="item.id"
      class="img-set-item relative"
    >
      <div
        class="absolute"
        h="full"
        p="4"
        w="full"
      >
        <ImgSetCard
          :description="item.description"
          :is-selected="isSelected(item.id)"
          :name="item.name"
          @click="click(item.id)"
        />
      </div>
    </div>
  </div>
  <div
    bottom="10"
    class="float-buttons"
    fixed="~"
    flex="~ row"
    right="10"
    space="x-4"
    z="10"
  >
    <DelButton
      :class="{'del-btn-on': isDelMode}"
      @click="clickDelBtn"
    />
    <AddButton @click="addImgSetDialog" />
  </div>
  <AddImgSetDialog
    v-model:is-show="isShowDialog"
  />
</template>

<script lang="ts" setup>
import {myImgDB} from '/@/plugins/indexDB';
import {computed, ref, watch} from 'vue';
import {stateStore} from '/@/stores/state';
import {onClickOutside, useMagicKeys} from '@vueuse/core';
import {delImgSet as _delImgSet} from '/@/plugins/img';
import {useRouter} from 'vue-router';

const state = stateStore();
const {ctrl} = useMagicKeys();

const allImgSetInfo = ref();
const imgSetDiv = ref();
const selectedImgSetId = ref(new Set<string>);
const isShowDialog = ref(false);
const isMultiSelectMode = ref(false);
const isDelMode = ref(false);
const clickOutsideRef = ref(null);
const isSpecialMode = computed(() => isDelMode.value /* || isOtherMode */);
const router = useRouter();

function getImgSetInfo() {
  myImgDB.getAllImgSet().then((imgSetInfo) => {
    allImgSetInfo.value = imgSetInfo!;
  });
}

function clickIn(id: string) {
  if (!isDelMode.value) {
    router.push({name: 'ocr-project-images', params: {prjId: id}});
  }
}

// for select multi card
function click(id: string) {
  if (isMultiSelectMode.value) {
    selectedImgSetId.value.has(id)
      ? selectedImgSetId.value.delete(id)
      : selectedImgSetId.value.add(id);
  } else if (isDelMode.value) {
    delImgSet(id);
  } else {
    clickIn(id);
  }
}

// for buttons
const isSelected = computed(() => {
  return (id: string) => selectedImgSetId.value.has(id);
});

const addImgSetDialog = () => isShowDialog.value = true;

// Operations when click `DelButton`
const clickDelBtn = () => {
  // Change DelMode
  if (!isDelMode.value) {
    isDelMode.value = true;
  } else {
    isDelMode.value = false;
  }
};

// async del img set
// TODO: CONFIRM dialog
const delImgSet = async (id: Set<string> | Array<string> | string) => {
  let _id: Set<string>;
  if (typeof id === 'string') _id = new Set([<string>id]);
  else if (id instanceof Array) _id = new Set(<Array<string>>id);
  else if (id instanceof Set) _id = <Set<string>>id;
  else _id = new Set<string>();

  if (state.isInSet && _id.has(state.ocr.prjId)) {
    state.clearOcrPrjId();
    state.clearOcrImgId();
  }
  await _id.forEach(async (v: string) =>
    await _delImgSet(v)
      .then(() => _id.clear())
      .finally(() => getImgSetInfo()));

  isDelMode.value = false;
};

/*
Listen to Events
 */

// Only in `Special Mode` can you choose multiply files.
watch(ctrl, (v) => isMultiSelectMode.value = isSpecialMode.value && v);

// Refresh img set data after adding new img set.
watch(isShowDialog, getImgSetInfo);

//
watch(isMultiSelectMode, (v) => {
  if (!v && isDelMode.value) delImgSet(selectedImgSetId.value);
});

// Cancel all selected items when click outside the items.
onClickOutside(clickOutsideRef, () => {
  if (!isMultiSelectMode.value) selectedImgSetId.value.clear();
});

/*
exec once
 */

getImgSetInfo();
</script>

<style lang="scss" scoped>
.img-set-item {
  height: 0;
  padding-bottom: 50%;
}

.del-btn-on {
  @apply bg-red-300/50;
}
</style>
