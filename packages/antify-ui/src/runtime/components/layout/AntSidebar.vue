<script lang="ts">
export default {
  name: 'AntSidebar',
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
import { faX } from '@fortawesome/free-solid-svg-icons';

const { open } = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
});
</script>

<template>
  <div
    v-if="open"
    class="fixed right-0 top-0 w-screen h-screen bg-black bg-opacity-20"
    @click="$emit('update:open', false)"
  />

  <div v-if="open" class="bg-white fixed top-0 right-0 w-48 h-screen">
    <div class="flex justify-between border-b py-4 px-3">
      <div>
        <slot name="title" />
      </div>

      <div>
        <fa-icon :icon="faX" @click="$emit('update:open', false)" />
      </div>
    </div>

    <div class="py-4 px-3">
      <slot name="content" />
    </div>
  </div>
</template>
