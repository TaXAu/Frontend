<template>
  <OcrTopBar />
  <div
    :key="prjId"
    class="img-view"
    grid="~ <sm:cols-1 sm:<md:cols-2 md:<lg:cols-3 lg:<xl:cols-4 xl:<2xl:cols-5 2xl:cols-6"
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
          @click="intoImgInfoPage(item.id)"
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
import {computed, ref, watch} from 'vue';
import {openImgSelectorDialog} from '/@/electron/api';
import Folder from '@material-design-icons/svg/round/folder.svg';
import Image from '@material-design-icons/svg/round/image.svg';
import {useRouter} from 'vue-router';
import {stateStore} from '/@/stores/state';
import type {img as imgDBType} from '/@/utils/indexDB';
import {myImgDB as db} from '/@/utils/indexDB';

const router = useRouter();
const state = stateStore();
defineProps({prjId: String});

const imgData = ref(new Array<displayImgInfo>);
const intoImgInfoPage = (id: string) =>
  router.push({name: 'ocr-project-image-detail', params: {imgId: id}});

// get Project ID from props and store
const prjId = computed(() => state.ocr.prjId);

// get img data from indexedDB and display in html
async function getImgData() {
  if (prjId.value) {
    await getDisplayImgInfo(prjId.value).then((value) => {
      if (value !== undefined) {
        imgData.value = value;
      }
    });
  }
}

// for display basic info of images in ImgView.vue
interface displayImgInfo {
  id: string,
  filename: string,
  uploadTime: Date,
  lastModifiedTime: Date,
  url: string
}

async function getDisplayImgInfo(prjId: string): Promise<displayImgInfo[] | void> {
  const images: imgDBType[] | void = await db.getAllImg(prjId);
  const displayImages: displayImgInfo[] = [];
  if (images !== undefined) {
    images.forEach((image) => {
      if (('dataUrl' in image && image.dataUrl !== undefined) ||
        ('url' in image && image.url !== undefined)) {
        const displayImage: displayImgInfo = {
          id: image.id,
          filename: image.filename,
          uploadTime: image.uploadTime,
          lastModifiedTime: image.lastModifiedTime,
          url: 'dataUrl' in image ? image.dataUrl! : image.url!,
        };
        displayImages.push(displayImage);
      }
      // TODO
      // 'else if' Blob and Path case
    });
    return displayImages;
  }
}

// get image date the first time get in the component
getImgData();
watch(prjId, getImgData);
watch(() => state.ocr.changedImgId, (value) => {
  if (value) {
    getImgData();
  }
});


// add img from local files
// use indexedDB
async function addImg(type: 'file' | 'directory') {
  await openImgSelectorDialog(type);
}
</script>

<style lang="scss" scoped>
.img-card-bkg {
  height: 0;
  padding-bottom: 100%;
}
</style>
