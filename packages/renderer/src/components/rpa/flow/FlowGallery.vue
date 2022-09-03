<template>
  <div class="flow-gallery">
    <div
      v-for="(item, i) in modules"
      :key="i"
      class="module-category"
    >
      <div
        class="category-block"
        @click="item.isExpand = !item.isExpand"
      >
        <p class="name">
          {{ item.name }}
        </p>
        <div flex="auto" />
        <ExpandMore v-show="item.isExpand === true" />
        <ExpandLess v-show="item.isExpand === false" />
      </div>

      <div
        v-for="(module, j) in item?.modules"
        v-show="!item.isExpand"
        :key="j"
        class="module-block"
      >
        <p class="name">
          {{ module.name }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ExpandMore from '@material-design-icons/svg/round/arrow_drop_up.svg';
import ExpandLess from '@material-design-icons/svg/round/arrow_drop_down.svg';
import {flowStore} from '/@/stores/flow';
import {ref} from 'vue';

const modules = ref(flowStore().modules.map((item) => {
  return {
    isExpand: false,
    ...item,
  };
}));

</script>

<style lang="scss" scoped>
.module-category {
  p {
    @apply select-none;
  }
}

.module-block, .category-block {
  @apply px-5 h-10;
  @apply flex items-center;
  @apply rounded-lg;
  @apply hover:bg-light-600;

  &.module-block {
    @apply ml-5 my-2;
  }

  &.category-block {
  }
}
</style>
