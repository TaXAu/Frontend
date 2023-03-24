<script lang="ts" setup>
const prop = defineProps({ size: String })
</script>

<template>
  <div
    class="button items-center"
    flex="~"
    items="center"
    justify="center"
    rounded="full"
    shadow="xl"
  >
    <slot />
  </div>
</template>

<style lang="scss" scoped>
$buttonSize: v-bind('prop.size');
.button {
  height: $buttonSize;
  width: $buttonSize;
  //background-color: v-bind('prop.color');
}

.content {
  height: 50%;
  width: 50%;
  background-color: antiquewhite;

  ::before {
    height: 100%;
  }
}
</style>
