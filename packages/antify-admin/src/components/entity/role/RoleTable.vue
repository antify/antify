<script lang="ts" setup>
import { ANT_ROW_TYPES } from '@antify/antify-ui';
import TenantLink from '~~/components/fields/TenantLink.vue';
import { TableHeader } from '@antify/antify-ui/dist/types/TableHeader.type';
import { useContextHeader, useTenantHeader } from '@antify/context';

const route = useRoute();
const { data: roles } = await useFetch(
  `/api/components/entity/role/role-table/roles`,
  {
    headers: {
      // TODO:: remove with nuxt 3.2.0
      ...useRequestHeaders(),
      ...useContextHeader('tenant'),
      ...useTenantHeader(route.params.tenantId as string),
    },
  }
);

const _roles = computed(() => {
  return roles.value.default.map((role) => {
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

const tableHeaders = ref<Array<TableHeader>>([
  {
    title: 'Role',
    identifier: 'name',
    type: ANT_ROW_TYPES.SLOT,
  },
]);
</script>

<template>
  <AntTable
    :headers="tableHeaders"
    :data="_roles"
  >
    <template #cellContent="{ elem }">
      <TenantLink
        class="block w-full"
        :to="{
          name: 'backoffice-tenantId-roles-roleId',
          params: { roleId: elem.id },
        }"
      >
        {{ elem.name }}
      </TenantLink>
    </template>
  </AntTable>
</template>
