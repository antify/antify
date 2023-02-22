<script lang="ts" setup>
const route = useRoute();

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
  <AntMailerModuleListingPage
    context="tenant"
    :tenant-id="$route.params.tenantId"
    :get-detail-route="getDetailRoute"
  />
</template>
