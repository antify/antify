<script lang="ts" setup>
const getDetailRoute = (mailTemplateId) => ({
  name: 'core-mail-templates-mailTemplateId',
  params: { mailTemplateId },
});
</script>

<template>
  <AntMailerModuleListingPage
    context="core"
    :get-detail-route="getDetailRoute"
  />
</template>
