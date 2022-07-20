<script setup>
const { data: permissions } = await useFetch(
  '/api/roles/permissions',
  useDefaultFetchOpts()
);
const role = {
  name: '',
  permissions: [],
};
</script>

<template>
  <AntContent>
    <template #head>
      <AntHeader>Rolle erstellen</AntHeader>
    </template>
    <template #body>
      <EntityRoleEditRoleForm :role="role" :permissions="permissions" />
    </template>
  </AntContent>
</template>
