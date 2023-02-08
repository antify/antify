<script lang="ts" setup>
import { ref } from 'vue';
import MediaUpload from '../../src/runtime/components/MediaUpload.vue';

const dir = ref('/test-dir');

const onAfterUpload = (files) => {
  console.log(files);
};
</script>

<template>
  <div class="p-8">
    <AntInput
      v-model:value="dir"
      label="Directory to upload"
      placeholder="Directory to upload"
      class="mb-8"
    />

    <MediaUpload
      provider="default"
      :directory="dir"
      @afterUpload="onAfterUpload"
    />
  </div>
</template>

<style scoped></style>
