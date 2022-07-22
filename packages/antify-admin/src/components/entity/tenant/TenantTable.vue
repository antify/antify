<script lang="ts" setup>
import { ROW_TYPES } from '@antify/antify-ui';
import TenantLink from '~~/components/fields/TenantLink.vue';

const route = useRoute();
const { data } = await useFetch('/api/tenants/tenants', useDefaultFetchOpts());

const _data = computed(() => {
  return (data.value.default as Array<any>).map((tenant) => {
    if (route.params?.tenantDetailId === tenant.id) {
      return {
        ...tenant,
        active: true,
      };
    }

    return {
      ...tenant,
      active: false,
    };
  });
});

const tableHeaders = [
  {
    title: 'name',
    identifier: 'name',
    type: ROW_TYPES.SLOT,
  },
];
</script>

<template>
  <AntTable :headers="tableHeaders" :data="_data">
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
