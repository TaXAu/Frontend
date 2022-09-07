<template>
  <div class="flow-editor">
    <div class="canvas">
      <div class="flow-blocks">
        <div
          v-for="(item, i) in editData?.program"
          :key="i"
          class="flow-block"
        >
          <div class="before">
            <p class="line_num">
              {{ i + 1 }}
            </p>
          </div>
          <div class="main">
            <div class="block">
              <p class="action-name">
                {{ item.name }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// import {flowStore} from '/@/stores/flow';

// const store = flowStore();
const editData = {
  program: [
    {
      name: 'aaaaaaa',
    },
    {
      name: 'bbbbbbb',
    },
    {
      name: 'ccccccc',
    },
  ],
};
</script>

<style scoped>
.flow-blocks {
  @apply py-2;
  @apply w-full h-full;
  @apply overflow-y-auto;
}

.flow-block {
  @apply flex items-center;
  @apply h-20;
  @apply select-none;

.before, .main {
  @apply flex;
  @apply h-full;
}

.before {
  @apply items-center;
  @apply w-8;
}

.main {
  @apply flex-auto;
  @apply py-2 pr-4;

.block {
  @apply flex items-center;
  @apply h-full w-full;
  @apply bg-white rounded-lg;
  @apply px-2;
}

}

.line_num, .action-name {
  @apply w-full;
}

.line_num {
  @apply text-center;
}

}
</style>
