<template>
  <div
    bg="light-400"
    class="card bkg"
    m="y-2"
    overflow="hidden"
    p="x-10 y-5"
    rounded="lg"
  >
    <div
      v-if="hasHeader"
      class="header leading-loose font-semibold text-xl tracking-wide"
    >
      {{ _header }}
    </div>
    <hr
      v-if="hasHeader"
      class="my-1 mx-0 h-1px border-none bg-gray-400"
    >
    <div
      class="main"
      leading="loose"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue';

const props = defineProps({header: String});
const hasHeader = computed(() => props.header ? true : false);
const _header = computed(() => props.header ?? '');
</script>
