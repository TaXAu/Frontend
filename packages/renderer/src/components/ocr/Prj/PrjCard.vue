<script lang="ts" setup>
defineProps({
  name: String, description: String, isSelected: Boolean,
})
</script>

<template>
  <div
    :class="{ 'selected-card': isSelected }"
    bg="zinc-100 hover:zinc-200"
    class="card"
    flex="~ col"
    h="full"
    overflow="hidden"
    p="4"
    rounded="xl"
    select="none"
  >
    <p
      class="card-name"
      flex="none"
      font="semibold"
      hover="underline"
      text="lg blue-700/80"
    >
      {{ name }}
    </p>
    <p
      class="card-description"
      flex="initial"
      overflow="hidden"
      text="sm"
    >
      {{ description }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.card-name {
  overflow: hidden;
  white-space: nowrap; /*限制不换行*/
  text-overflow: ellipsis;
}

.selected-card {
  @apply ring-2 ring-blue-700/80 ring-offset-6
}

//.card-description {
//  overflow:hidden;
//  text-overflow:ellipsis;
//  display:-webkit-box;
//  -webkit-line-clamp:3;
//  -webkit-box-orient:vertical;
//}
</style>
