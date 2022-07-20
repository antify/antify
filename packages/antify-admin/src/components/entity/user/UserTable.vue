<script lang="ts" setup>
import { ROW_TYPES } from '@antify/antify-ui';
import TenantLink from '~~/components/fields/TenantLink.vue';

const props = defineProps<{
  singleCol: boolean;
}>();

const { data: users } = await useFetch(
  '/api/users/users',
  useDefaultFetchOpts()
);

const tableHeaders = [
  {
    title: 'Name',
    identifier: 'name',
    headerClass: 'font-bold',
    type: ROW_TYPES.SLOT,
  },
];

if (!props.singleCol) {
  tableHeaders.push({
    title: 'E-Mail',
    identifier: 'email',
    headerClass: 'font-bold',
    type: ROW_TYPES.TEXT,
  });
}
</script>

<template>
  <AntTable :headers="tableHeaders" :data="users">
    <template #cellContent="{ elem }">
      <TenantLink
        :to="{
          name: 'admin-tenantId-users-userId',
          params: { userId: elem.id },
        }"
      >
        {{ elem.name }}
      </TenantLink>
    </template>
  </AntTable>
</template>
