<template>
  <nav
    h="full"
  >
    <div
      bg="light-100"
      class="link-button-group"
      h="full"
      p="1"
    >
      <div
        v-for="item in itemData"
        :key="item.key"
        :class="{'chosen': isHighlight(item.key),'highlight': !isHighlight(item.key)}"
        class="link-button"
        cursor="default"
        font="medium"
        h="3rem"
        leading="3rem"
        m="2"
        rounded="2xl"
        select="none"
        text="center"
        @click="clickLinkButton(item.key)"
      >
        {{ item.name }}
      </div>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import type {OcrSubNavItemType} from '/@/config';
import {OcrSubNavItem as itemData} from '/@/config';
import {stateStore} from '/@/stores/state';

const isHighlight = (key: OcrSubNavItemType['key']) => key === stateStore().ocr.subNav.chosenKey;
const clickLinkButton = (key: OcrSubNavItemType['key']) => {
  // change the state of chosen key in stateStore
  stateStore().changeOcrSubNavChosenKey(key);
};
</script>

<style lang="scss" scoped>
.link-button-group {
  .highlight {
    @apply hover:bg-light-700;
  }

  .chosen {
    @apply ring-2 ring-black ring-opacity-70
  }
}
</style>
