<script lang="ts" setup>
import { ref } from 'vue';
import MediaImage from '../../src/runtime/components/MediaImage.vue';

const path = ref('');
</script>

<template>
  <div class="p-8">
    <AntInput
      v-model:value="path"
      label="Image path"
      placeholder="Image path"
      class="mb-8"
    />

    <MediaImage
      v-if="path"
      provider="default"
      :path="path"
    />
  </div>
</template>

<style scoped></style>
