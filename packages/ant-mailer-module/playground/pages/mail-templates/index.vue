<script lang="ts" setup>
const getDetailRoute = (mailTemplateId) => ({
  name: 'mail-templates-mailTemplateId',
  params: { mailTemplateId },
});
</script>

<template>
  <AntMailerModuleListingPage
    context="tenant"
    tenant-id="0815"
    :get-detail-route="getDetailRoute"
  />
</template>
