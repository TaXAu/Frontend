<script lang="ts" setup>
defineProps({ text: String, editable: Boolean })
const emits = defineEmits(['update:text'])

function updateText(e: any) {
  emits('update:text', e.target.innerText)
}
</script>

<template>
  <p
    :contenteditable="editable"
    @input="updateText"
  >
    {{ text }}
  </p>
</template>

<style lang="scss" scoped>

</style>
