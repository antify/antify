<script lang="ts" setup>
import { ROW_TYPES } from '@antify/antify-ui';
import TenantLink from '~~/components/fields/TenantLink.vue';

const { data } = await useFetch(
  '/api/mail_templates/mail_templates',
  useDefaultFetchOpts()
);
const tableHeader = [
  {
    title: 'Name',
    identifier: 'title',
    type: ROW_TYPES.SLOT,
  },
];
</script>

<template>
  <AntTable :headers="tableHeader" :data="data">
    <template #cellContent="{ elem }">
      <TenantLink
        :to="{
          name: 'admin-tenantId-mail-templates-mailTemplateId',
          params: { mailTemplateId: elem.id },
        }"
      >
        {{ elem.title }}
      </TenantLink>
    </template>
  </AntTable>
</template>
