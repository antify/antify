<script lang="ts" setup>
const route = useRoute();
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
  <AntMediaModuleListingPage
    provider="tenant"
    :tenant-id="route.params.tenantId"
    upload-dir="/tenant"
    :get-detail-route="getDetailRoute"
  />
</template>
