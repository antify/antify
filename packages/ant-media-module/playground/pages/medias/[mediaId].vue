<script lang="ts" setup>
const route = useRoute();
const getListingRoute = () => ({
  name: 'medias',
});
const getDetailRoute = (mediaId) => ({
  name: 'medias-mediaId',
  params: { mediaId },
});
</script>

<template>
  <AntMediaModuleDetailPage
    provider="tenant"
    tenant-id="0815"
    :media-id="route.params.mediaId"
    :get-listing-route="getListingRoute"
    :get-detail-route="getDetailRoute"
  />
</template>
