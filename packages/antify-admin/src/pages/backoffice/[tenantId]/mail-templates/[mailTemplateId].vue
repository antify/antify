<script lang="ts" setup>
const route = useRoute();

const getListingRoute = () =>
  useBuildTenantLink(
    {
      name: 'backoffice-tenantId-mail-templates',
    },
    route
  );
const getDetailRoute = (mailTemplateId) =>
  useBuildTenantLink(
    {
      name: 'backoffice-tenantId-mail-templates-mailTemplateId',
      params: { mailTemplateId },
    },
    route
  );
</script>

<template>
  <AntMailerModuleDetailPage
    context="tenant"
    :tenant-id="$route.params.tenantId"
    :mail-template-id="$route.params.mailTemplateId"
    :get-listing-route="getListingRoute"
    :get-detail-route="getDetailRoute"
  />
</template>
