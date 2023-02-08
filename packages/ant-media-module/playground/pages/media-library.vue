<script lang="ts" setup>
import MediaTable from '../../src/runtime/components/MediaTable.vue';
</script>

<template>
  <div>
    <MediaTable
      :media-files="[]"
      @reload-media="() => null"
    />
  </div>
</template>

<style scoped></style>
