<script lang="ts" setup>
import { ROW_TYPES } from '@antify/antify-ui';
import TenantLink from '~~/components/fields/TenantLink.vue';

const { data: roles } = await useFetch(
  '/api/roles/roles',
  useDefaultFetchOpts()
);

const tableHeaders = [
  {
    title: 'Rollen',
    identifier: 'name',
    type: ROW_TYPES.SLOT,
  },
];
</script>

<template>
  <AntTable :headers="tableHeaders" :data="roles">
    <template #cellContent="{ elem }">
      <TenantLink
        :to="{
          name: 'admin-tenantId-roles-roleId',
          params: { roleId: elem.id },
        }"
      >
        {{ elem.name }}
      </TenantLink>
    </template>
  </AntTable>
</template>
