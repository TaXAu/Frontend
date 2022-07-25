<template>
  <canvas
    id="img-canvas"
    ref="canvasElement"
    h="full"
    rounded="lg"
    w="full"
  />
</template>

<script lang="ts" setup>
import {fabric} from 'fabric';
import {onMounted, ref} from 'vue';

const canvasElement = ref<HTMLCanvasElement>();

onMounted(() => {
  const width = canvasElement.value?.clientWidth ?? 100;
  const height = canvasElement.value?.clientHeight ?? 100;
  const canvas = new fabric.Canvas('img-canvas', {
    width,
    height,
  });
  canvas.setBackgroundColor('#f6f6f6', () => {
    canvas.renderAll();
  });
  fabric.Image.fromURL('https://i.bmp.ovh/imgs/2022/07/25/c6d6206b72b5318d.jpg', (img) => {
    if (typeof img !== 'undefined') {
      const scale = Math.min(width / img.width!, height / img.height!);
      img.scale(scale);
      img.set({
        left: (width - img.width! * scale) / 2,
        top: (height - img.height! * scale) / 2,
      });
      canvas.add(img);
      canvas.renderAll();
    }
  });
});
</script>
