<script lang="ts" setup>
import Toaster from '../../src/runtime/components/Toaster.vue';
const { $toaster } = useNuxtApp();
</script>

<template>
  <div class="p-4 flex space-x-4">
    <AntButton @click="() => $toaster.toastSuccess('Success message here')"
      >Toast success</AntButton
    >
    <AntButton @click="() => $toaster.toastWarning('Warning message here')"
      >Toast warning</AntButton
    >
    <AntButton @click="() => $toaster.toastError('Error message here')"
      >Toast error</AntButton
    >

    <Toaster />
  </div>
</template>
