<template>
  <div
    ref="imgSetDiv"
    class="img-sets-overview"
    grid="~ cols-2"
    p="4"
  >
    <div
      v-for="item in allImgSetInfo"
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
          @click="clickIn(item.id)"
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
    <DelButton />
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

const state = stateStore();
const allImgSetInfo = ref();
const imgSetDiv = ref();
const selectedImgSetId = ref(new Set<string>);
const isShowDialog = ref(false);

function getImgSetInfo() {
  myImgDB.getAllImgSet().then((imgSetInfo) => {
    allImgSetInfo.value = imgSetInfo!;
  });
}

function clickIn(id: string) {
  state.intoSet(id);
  state.changeOcrPage('img-overview');
}

// for select multi card
// const selectImgSetCard = (id:string) =>
//     selectedImgSetId.value.has(id)
//     ? selectedImgSetId.value.delete(id)
//     : selectedImgSetId.value.add(id);


// for buttons
const isSelected = computed(() => {
  return (id: string) => selectedImgSetId.value.has(id);
});

const addImgSetDialog = () => isShowDialog.value = true;

watch(isShowDialog, getImgSetInfo);

getImgSetInfo();
</script>

<style lang="scss" scoped>
.img-set-item {
  height: 0;
  padding-bottom: 40%;
}
</style>
