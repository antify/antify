<script lang="ts" setup>
import { ROW_TYPES } from '@antify/antify-ui';
import TenantLink from '~~/components/fields/TenantLink.vue';

const route = useRoute();

const { data: roles } = await useFetch(
  '/api/roles/roles',
  useDefaultFetchOpts()
);

const _roles = computed(() => {
  return (roles.value as Array<any>).map((role) => {
    if (route.params?.roleId === role.id) {
      return {
        ...role,
        active: true,
      };
    }

    return {
      ...role,
      active: false,
    };
  });
});

const tableHeaders = [
  {
    title: 'Rollen',
    identifier: 'name',
    type: ROW_TYPES.SLOT,
  },
];
</script>

<template>
  <AntTable :headers="tableHeaders" :data="_roles">
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
