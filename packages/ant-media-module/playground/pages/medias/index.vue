<script lang="ts" setup>
const getDetailRoute = (mediaId) => ({
  name: 'medias-mediaId',
  params: { mediaId },
});
</script>

<template>
  <AntMediaModuleListingPage
    provider="tenant"
    tenant-id="0815"
    upload-dir="tenant"
    :get-detail-route="getDetailRoute"
  />
</template>
