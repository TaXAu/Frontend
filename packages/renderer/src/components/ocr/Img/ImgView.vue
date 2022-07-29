<template>
  <OcrTopBar />
  <div
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
import {ref, watch} from 'vue';
import {openImgSelectorDialog} from '/@/electron/api';
import Folder from '@material-design-icons/svg/round/folder.svg';
import Image from '@material-design-icons/svg/round/image.svg';
import type {displayImgInfo} from '/@/utils/prjDb';
import {addImgFromDataUrl, getDisplayImgInfo} from '/@/utils/prjDb';
import {useRoute, useRouter} from 'vue-router';

const route = useRoute();
const router = useRouter();
const props = defineProps({prjId: String});

const imgData = ref(new Array<displayImgInfo>);
const intoImgInfoPage = (id: string) =>
  router.push({name: 'ocr-project-image-detail', params: {imgId: id}});

// get Project ID from route and props
const prjId = ref<string>(props.prjId!);
watch(() => route.params.prjId, () => {
  if (route.params?.prjId) prjId.value = <string>route.params.prjId;
  getImgData();
});

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

getImgData();// get image date the first time get in the component


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
