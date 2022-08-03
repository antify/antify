<script
  setup
  lang="ts"
>
import RoleTable from '~~/components/entity/role/RoleTable.vue';
import TenantLink from '~~/components/fields/TenantLink.vue';
import { AntTabsType } from '@antify/antify-ui';
import { Response } from '../../../../glue/api/admin/[tenantId]/roles/[roleId].get';
import { Response as PermissionsResponse } from '~~/glue/api/admin/[tenantId]/roles/permissions.get';

const { $toaster } = useNuxtApp();
const route = useRoute();

const search = ref('');
const loading = ref(true);
const tabs = ref<AntTabsType[]>([
  {
    name: 'Stammdaten',
    current: true,
    to: '',
  },
]);
const role = ref<Response>({ default: {} });
const permissions = ref<PermissionsResponse>({ default: [] });

onMounted(async () => {
  const { data: permissionsData } = await useFetch<PermissionsResponse>(
    '/api/roles/permissions',
    useDefaultFetchOpts()
  );

  permissions.value = permissionsData.value as PermissionsResponse;
  console.log('loaded', permissions.value);

  const { data: roleData } = await useFetch<Response>(
    `/api/roles/${route.params.roleId}`,
    useDefaultFetchOpts()
  );

  role.value = roleData.value;

  loading.value = false;
});

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
        :role="role.default"
        :permissions="permissions.default"
        :loading="loading"
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
