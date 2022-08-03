<script
  lang="ts"
  setup
>
import { ANT_ROW_TYPES } from '@antify/antify-ui';
import TenantLink from '~~/components/fields/TenantLink.vue';
import { TableHeader } from '@antify/antify-ui/dist/types/TableHeader.type';
import { Response } from '~~/glue/api/admin/[tenantId]/roles/roles.get';

const route = useRoute();

const { data: roles } = await useFetch<Response>(
  '/api/roles/roles',
  useDefaultFetchOpts()
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
    title: 'Rollen',
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
