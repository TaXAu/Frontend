<template>
  <div
    bg="light-100 hover:light-400"
    border=""
    class="img-card relative"
    h="full"
    overflow="hidden"
    rounded="2xl"
    select="none"
  >
    <img
      :alt="filename"
      :src="url"
      h="full"
    >
    <div
      bg="light-400/80"
      class="card-name absolute bottom-0"
      inset="x-0"
      p="x-2 y-1"
      text="sm gray-800"
    >
      <p>
        {{ filename }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({filename: String, url: String});
</script>

<style lang="scss" scoped>
.card-name {
  p {
    overflow: hidden;
    white-space: nowrap; /*限制不换行*/
    text-overflow: ellipsis;
  }
}

img {
  object-fit: cover;
}

</style>
