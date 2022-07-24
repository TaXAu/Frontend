<template>
  <OcrTopBar />
  <div
    class="img-view"
    grid="~ cols-3"
    p="4"
  >
    <div
      v-for="item in imgData"
      :key="item.id"
      class="img-card-bkg relative"
    >
      <div
        class="absolute"
        h="full"
        p="4"
        w="full"
      >
        <ImgCard
          :filename="item.filename"
          :url="item.url"
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
    <RoundedButton
      bg="blue-200/50"
      size="3rem"
      @click="addImg('directory')"
    >
      <Folder
        class="transform"
        fill="blue-600/80"
        scale="100"
      />
    </RoundedButton>
    <RoundedButton
      bg="blue-200/50"
      size="3rem"
      @click="addImg('file')"
    >
      <Image
        class="transform"
        fill="blue-600/80"
        scale="100"
      />
    </RoundedButton>
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {openImgSelectorDialog} from '/@/electron/api';
import Folder from '@material-design-icons/svg/round/folder.svg';
import Image from '@material-design-icons/svg/round/image.svg';
import type {displayImgInfo} from '/@/plugins/img';
import {addImgFromDataUrl, getDisplayImgInfo} from '/@/plugins/img';

const imgData = ref(new Array<displayImgInfo>);

// get img data from indexedDB and display in html
async function getImgData() {
  await getDisplayImgInfo().then((value) => {
    if (value !== undefined) {
      imgData.value = value;
    }
  });
}

getImgData();


// add img from local files
// use indexedDB
async function addImg(type: 'file' | 'directory') {
  const result = await openImgSelectorDialog(type);
  if (result !== undefined) {
    for (const img of result) {
      await addImgFromDataUrl(img);
    }
    await getImgData();
  }
}
</script>

<style lang="scss" scoped>
.img-card-bkg {
  height: 0;
  padding-bottom: 100%;
}
</style>
