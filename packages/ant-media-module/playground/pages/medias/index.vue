<script lang="ts" setup>
const getDetailRoute = (mediaId) => ({
  name: 'medias-mediaId',
  params: { mediaId },
});
</script>

<template>
  <AntMediaModuleListingPage
    provider="core"
    upload-dir="core"
    :get-detail-route="getDetailRoute"
  />
</template>
