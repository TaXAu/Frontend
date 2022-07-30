<template>
  <div
    ref="canvasPlaceElement"
    h="full"
    overflow="hidden"
    w="full"
  >
    <canvas
      id="img-canvas"
      rounded="lg"
      w="full"
    />
  </div>
</template>

<script lang="ts" setup>
import {fabric} from 'fabric';
import {onMounted, ref, watch} from 'vue';
import {useResizeObserver} from '@vueuse/core';
import {stateStore} from '/@/stores/state';
import {readImgFromPath} from '/@/electron/api';
import {READ_IMG_FROM_FS_CODE} from '../../../../../../config/code';

const canvasPlaceElement = ref<HTMLCanvasElement>();
const elSize = ref<{ width: number, height: number }>();
const canvasSize = ref<{ width: number, height: number }>();
const imageScale = ref<number>();
const state = stateStore();
let canvas: fabric.Canvas;
let image: fabric.Image;

function resizeCanvas() {
  if (canvas && elSize.value) {
    canvas.setWidth(elSize.value.width);
    canvas.setHeight(elSize.value.height);
    canvas.renderAll();
    canvasSize.value = elSize.value;
  }
}

function resizeCanvasImage(img?: fabric.Image) {
  const _image = img ?? image;
  if (_image && canvasSize.value) {
    imageScale.value = Math.min(
      canvasSize.value.width / _image.width!,
      canvasSize.value.height / _image.height!,
    );
    _image.scale(imageScale.value);
    if (canvas) canvas.renderAll();
  }
}

function centerCanvasImage(img?: fabric.Image) {
  const _image = img ?? image;
  if (_image && canvasSize.value) {
    let scale = 1;
    if (imageScale.value) scale = imageScale.value;
    _image.set({
      left: (canvasSize.value.width - _image.width! * scale) / 2,
      top: (canvasSize.value.height - _image.height! * scale) / 2,
    });
    if (canvas) canvas.renderAll();
  }
}

onMounted(() => {
  // get element size
  if (canvasPlaceElement.value) {
    elSize.value = {
      width: canvasPlaceElement.value.clientWidth,
      height: canvasPlaceElement.value.clientHeight,
    };
  }

  /* Canvas Actions */

  // init canvas
  canvas = new fabric.Canvas('img-canvas');
  resizeCanvas();
  canvas.setBackgroundColor('#f6f6f6', () => {
    canvas.renderAll();
  });
});

// resize canvas on window resize
useResizeObserver(canvasPlaceElement, () => {
  if (canvasPlaceElement.value) {
    elSize.value = {
      width: canvasPlaceElement.value.clientWidth,
      height: canvasPlaceElement.value.clientHeight,
    };
  }
  resizeCanvas();
  resizeCanvasImage();
});

// change display image when image is changed
watch(() => state.ocr.img?.id, () => {
  updateImgFromFs();
});

function updateImgFromFs() {
  if (state.ocr.img && canvas) {
    readImgFromPath(state.ocr.img.path!).then((result) => {
      if (result.code === READ_IMG_FROM_FS_CODE.SUCCESS) {
        const img = result.result!;
        if (image) {
          canvas.remove(image);
        }
        fabric.Image.fromURL(img.dataUrl, (img) => {
          if (img) {
            resizeCanvasImage(img);
            centerCanvasImage(img);
            canvas.add(img);
            image = img;
          }
          canvas.renderAll();
        });
      }
    });
  }
}
</script>
