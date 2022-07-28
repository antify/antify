<script
  setup
  lang="ts"
>
import RoleTable from '~~/components/entity/role/RoleTable.vue';
import TenantLink from '~~/components/fields/TenantLink.vue';
import { AntTabsType } from '@antify/antify-ui';
import { Response } from '../../../../glue/api/admin/[tenantId]/roles/[roleId].get';

const { $toaster } = useNuxtApp();
const route = useRoute();

const search = ref('');
const tabs = ref<AntTabsType[]>([
  {
    name: 'Stammdaten',
    current: true,
    to: '',
  },
]);

const { data: role } = await useFetch<Response>(
  `/api/roles/${route.params.roleId}`,
  useDefaultFetchOpts()
);
const { data: permissions } = await useFetch(
  '/api/roles/permissions',
  useDefaultFetchOpts()
);

async function onDelete() {
  await useFetch(`/api/roles/${route.params.roleId}`, {
    ...useDefaultFetchOpts(),
    method: 'DELETE',
  });

  $toaster.toastDeleted();

  await navigateTo({
    name: 'admin-tenantId-roles',
    params: {
      roleId: route.params.roleId,
      tenantId: route.params.tenantId,
    },
  });
}
</script>

<template>
  <AntDualContent>
    <template #mainHead>
      <AntTabs :tabs="tabs" />
      <DeleteButton @click="onDelete">Löschen </DeleteButton>
    </template>

    <template #mainBody>
      <EntityRoleEditRoleForm
        :role="role"
        :permissions="permissions"
        id="edit-role-form"
      />
    </template>

    <template #mainFooter>
      <AntButton>
        <TenantLink :to="{ name: 'admin-tenantId-roles' }">Zurück</TenantLink>
      </AntButton>

      <AntButton
        :primary="true"
        type="submit"
        form="edit-role-form"
      >
        Speichern
      </AntButton>
    </template>

    <template #asideHead>
      <AntInput
        v-model:value="search"
        placeholder="Suche"
      />
    </template>

    <template #asideBody> <RoleTable /> </template>
  </AntDualContent>
</template>
