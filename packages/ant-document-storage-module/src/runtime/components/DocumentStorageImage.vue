<script lang="ts" setup>
const props = defineProps<{
  provider: string;
  path: string;
}>();
const { $documentStorageClient } = useNuxtApp();
</script>

<template>
  <img
    :src="`${$documentStorageClient().getUrlFromProvider(
      props.provider
    )}/files/${path}`"
    lazy
  />
</template>
