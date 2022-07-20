<script setup>
import RoleTable from '~~/components/entity/role/RoleTable.vue';
import TenantLink from '~~/components/fields/TenantLink.vue';
const { data: role } = await useFetch(
  `/api/roles/${useRoute().params.roleId}`,
  useDefaultFetchOpts()
);
const { data: permissions } = await useFetch(
  '/api/roles/permissions',
  useDefaultFetchOpts()
);
const { $toaster } = useNuxtApp();

const search = ref('');
const onDelete = async () => {
  await useFetch(`/api/roles/${useRoute().params.roleId}`, {
    ...useDefaultFetchOpts(),
    method: 'DELETE',
  });

  $toaster.toastDeleted();

  await navigateTo({
    name: 'admin-tenantId-roles',
    params: {
      roleId: useRoute().params.roleId,
      tenantId: useRoute().params.tenantId,
    },
  });
};
</script>

<template>
  <AntDualContent>
    <template #mainHead>
      <AntHeader>Rolle {{ role ? role.name : '' }} bearbeiten</AntHeader>
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

      <AntButton :primary="true" type="submit" form="edit-role-form">
        Speichern
      </AntButton>
    </template>

    <template #asideHead>
      <AntInput v-model:value="search" placeholder="Suche" />
    </template>

    <template #asideBody> <RoleTable /> </template>
  </AntDualContent>
</template>
