<script lang="ts" setup>
import { ref } from 'vue'

const imgData = ref([{ id: 1, name: 'test' }])
</script>

<template>
  <h1>Data</h1>
  <vxe-table
    :data="imgData"
  >
    <vxe-column field="id" title="ID" />
    <vxe-column field="name" title="Name" />
  </vxe-table>
</template>
