<script lang="ts" setup>
import { ANT_ROW_TYPES } from '@antify/antify-ui';
import TenantLink from '~~/components/fields/TenantLink.vue';
import { TableHeader } from '@antify/antify-ui/dist/types/TableHeader.type';

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

const tableHeaders = ref<Array<TableHeader>>([
  {
    title: 'name',
    identifier: 'name',
    type: ANT_ROW_TYPES.SLOT,
  },
]);
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
