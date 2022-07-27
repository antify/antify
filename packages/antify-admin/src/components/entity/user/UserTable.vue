<script lang="ts" setup>
import { ROW_TYPES } from '@antify/antify-ui';
import TenantLink from '~~/components/fields/TenantLink.vue';

const route = useRoute();
const props = defineProps<{
  singleCol: boolean;
}>();

const { data: users } = await useFetch(
  '/api/users/users',
  useDefaultFetchOpts()
);

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
  <AntTable :headers="tableHeaders" :data="_users">
    <template #cellContent="{ elem }">
      <TenantLink
        class="w-full"
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
