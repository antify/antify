<script lang="ts" setup>
const route = useRoute();
const getListingRoute = () =>
  useBuildTenantLink(
    {
      name: 'backoffice-tenantId-media',
    },
    route
  );
const getDetailRoute = (mediaId) =>
  useBuildTenantLink(
    {
      name: 'backoffice-tenantId-media-mediaId',
      params: { mediaId },
    },
    route
  );
</script>

<template>
  <AntMediaModuleDetailPage
    provider="tenant"
    :tenant-id="route.params.tenantId"
    :media-id="route.params.mediaId"
    :get-listing-route="getListingRoute"
    :get-detail-route="getDetailRoute"
  />
</template>
