<script setup>
const { data: role } = await useFetch(
  `/api/roles/${useRoute().params.roleId}`,
  useDefaultFetchOpts()
);
const { data: permissions } = await useFetch(
  "/api/roles/permissions",
  useDefaultFetchOpts()
);
const { $toaster } = useNuxtApp();

const onDelete = async () => {
  await useFetch(`/api/roles/${useRoute().params.roleId}`, {
    ...useDefaultFetchOpts(),
    method: "DELETE",
  });

  $toaster.toastDeleted();

  await navigateTo({
    name: "admin-tenantId-roles",
    params: {
      roleId: useRoute().params.roleId,
      tenantId: useRoute().params.tenantId,
    },
  });
};
</script>

<template>
  <AntContent>
    <template #head>
      <AntHeader>Rolle {{ role ? role.name : "" }} bearbeiten</AntHeader>
      <DeleteButton @click="onDelete">Löschen </DeleteButton>
    </template>

    <template #body>
      <EntityRoleEditRoleForm :role="role" :permissions="permissions" />
    </template>
  </AntContent>
</template>
