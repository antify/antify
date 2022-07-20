<script lang="ts" setup>
import { ROW_TYPES } from '@antify/antify-ui';
import TenantLink from '~~/components/fields/TenantLink.vue';

const { data } = await useFetch('/api/tenants/tenants', useDefaultFetchOpts());

const tableHeaders = [
  {
    title: 'name',
    identifier: 'name',
    type: ROW_TYPES.SLOT,
  },
];
</script>

<template>
  <AntTable :headers="tableHeaders" :data="data.default">
    <template #cellContent="{ elem }">
      <TenantLink
        :to="{
          name: 'admin-tenantId-tenants-tenantDetailId',
          params: { tenantDetailId: elem.id },
        }"
      >
        {{ elem.name }}
      </TenantLink>
    </template>
  </AntTable>
</template>
