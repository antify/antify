<script lang="ts" setup>
import { AntToaster, ANT_TOASTER_TYPE } from '@antify/antify-ui';
import { ToastType } from '../types';
const { $toaster } = useNuxtApp();

const toasts = computed(() => {
  const elem = $toaster.getToasts().map((toast) => ({
    id: toast.id,
    message: toast.text,
    type:
      toast.type === ToastType.error
        ? ANT_TOASTER_TYPE.ERROR
        : toast.type === ToastType.warning
        ? ANT_TOASTER_TYPE.WARNING
        : ANT_TOASTER_TYPE.NOTIFICATION,
  }));

  return elem;
});
</script>

<template>
  <AntToaster :toasts="toasts">
    <template #default="{ toast }">{{ toast.message }}</template>
  </AntToaster>
</template>
