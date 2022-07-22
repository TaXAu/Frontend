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
        :class="{'forbidden': isForbidden(item.key),
                 'chosen': isChosen(item.key)}"
        class="link-button highlight"
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
import {stateStore} from '/@/stores/state';
import type {ocrPageKeyType} from '/@//config';
import {ocrSubNavItem as itemData} from '/@//config';

const isForbidden = (key: ocrPageKeyType) => !stateStore().isOcrSubNavItemEnabled(key);
const isChosen = (key: ocrPageKeyType) => key === stateStore().ocr.nowPage;
const clickLinkButton = (key: ocrPageKeyType) => {
  // change the state of chosen key in stateStore
  stateStore().changeOcrPage(key);
};
</script>

<style lang="scss" scoped>
.link-button-group {
  .highlight {
    @apply hover:bg-light-500;
  }

  .forbidden {
    @apply pointer-events-none;
    // forbid click
    @apply text-gray-400;
  }

  .chosen {
    @apply ring-2 ring-black ring-opacity-70
  }
}
</style>
