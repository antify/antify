<script lang="ts" setup>
import { ANT_ROW_TYPES } from '@antify/antify-ui';
import TenantLink from '~~/components/fields/TenantLink.vue';
import { TableHeader } from '@antify/antify-ui/dist/types/TableHeader.type';
import { useContextHeader, useTenantHeader } from '@antify/context';

const route = useRoute();
const props = defineProps<{
  singleCol: boolean;
}>();
const { data: users, error } = await useFetch(
  '/api/components/backoffice/user/user-table',
  {
    headers: {
      // TODO:: remove with nuxt 3.2.0
      ...useRequestHeaders(),
      ...useContextHeader('tenant'),
      ...useTenantHeader(route.params.tenantId as string),
    },
  }
);

if (error.value) {
  throw createError(error.value.data);
}

const _users = computed(() => {
  return (users.value as Array<any>).map((user) => {
    if (route.params?.userId === user.id) {
      return {
        ...user,
        active: true,
      };
    }

    return {
      ...user,
      active: false,
    };
  });
});

const tableHeaders = ref<Array<TableHeader>>([
  {
    title: 'Name',
    identifier: 'name',
    headerClassList: 'font-bold',
    type: ANT_ROW_TYPES.SLOT,
  },
]);

if (!props.singleCol) {
  tableHeaders.value.push({
    title: 'E-Mail',
    identifier: 'email',
    headerClassList: 'font-bold',
    type: ANT_ROW_TYPES.TEXT,
  });
}
</script>

<template>
  <AntTable
    :headers="tableHeaders"
    :data="_users"
  >
    <template #cellContent="{ elem }">
      <TenantLink
        data-cy="user-link"
        class="w-full block"
        :to="{
          name: 'backoffice-tenantId-users-userId',
          params: { userId: elem.id },
        }"
      >
        {{ elem.name }}
      </TenantLink>
    </template>
  </AntTable>
</template>
