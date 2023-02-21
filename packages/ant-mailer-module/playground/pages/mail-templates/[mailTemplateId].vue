<script lang="ts" setup>
const route = useRoute();
const getListingRoute = () => ({
  name: 'mail-templates',
});
const getDetailRoute = (mailTemplateId) => ({
  name: 'mail-templates-mailTemplateId',
  params: { mailTemplateId },
});
</script>

<template>
  <AntMailerModuleDetailPage
    context="core"
    :mail-template-id="route.params.mailTemplateId"
    :get-listing-route="getListingRoute"
    :get-detail-route="getDetailRoute"
  />
</template>
