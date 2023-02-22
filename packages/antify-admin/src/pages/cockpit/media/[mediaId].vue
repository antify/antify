<script lang="ts" setup>
const getListingRoute = () => ({
  name: 'backoffice-tenantId-media',
});
const getDetailRoute = (mediaId) => ({
  name: 'cockpit-media-mediaId',
  params: { mediaId },
});
</script>

<template>
  <AntMediaModuleDetailPage
    provider="core"
    :media-id="route.params.mediaId"
    :get-listing-route="getListingRoute"
    :get-detail-route="getDetailRoute"
  />
</template>
