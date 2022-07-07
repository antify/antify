<script lang="ts">
export default {
  name: 'AntContext',
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
import AntTabs from '../tabs/AntTabs.vue';
</script>

<template>
  <div class="h-screen max-h-screen flex flex-col">
    <div class="border-b grow-0 shrink-0 basis-auto pl-10 md:pl-0">
      <slot name="head"></slot>
    </div>

    <div class="grow shrink-0 overflow-y-auto basis-auto">
      <slot name="body"></slot>
    </div>

    <div class="grow-0 shrink-0 basis-auto">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
