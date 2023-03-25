<script lang="ts" setup>
defineProps({ filename: String, url: String })
</script>

<template>
  <div
    border="1 zinc-400"
    class="img-card relative"
    h="full"
    overflow="hidden"
    duration="200"
    select="none"
    ease="in-out"
    hover="translate-x-1/30 -translate-y-1/30"
    rounded="lg"
    transform="~ gpu"
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
