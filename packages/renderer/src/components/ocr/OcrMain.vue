<template>
  <ImgSetView />
  <AddImgSetDialog
    v-model:is-show="isShowDialog"
  />
  <div
    bottom="10"
    class="float-buttons"
    fixed="~"
    z="10"
    flex="~ row"
    right="10"
    space="x-4"
  >
    <DelButton />
    <AddButton @click="addImgSetDialog" />
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue';

const isShowDialog = ref(false);
const addImgSetDialog = () => isShowDialog.value = true;
</script>
