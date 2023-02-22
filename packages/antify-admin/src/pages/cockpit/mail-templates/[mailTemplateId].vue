<script lang="ts" setup>
const getListingRoute = () => ({
  name: 'core-mail-templates',
});
const getDetailRoute = (mailTemplateId) => ({
  name: 'core-mail-templates-mailTemplateId',
  params: { mailTemplateId },
});
</script>

<template>
  <AntMailerModuleDetailPage
    context="core"
    :mail-template-id="$route.params.mailTemplateId"
    :get-listing-route="getListingRoute"
    :get-detail-route="getDetailRoute"
  />
</template>
