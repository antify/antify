import { permissions } from '../../../../server/datasources/static/permissions';
<script
  setup
  lang="ts"
>
const loading = ref(true);
const role = ref<{
  id?: string;
  name: string;
  isAdmin: boolean;
  permissions: string[];
}>({
  name: '',
  isAdmin: false,
  permissions: [],
});

const { data: permissions } = await useFetch(
  '/api/roles/permissions',
  useDefaultFetchOpts()
);
loading.value = false;
</script>

<template>
  <AntContent>
    <template #head>
      <AntHeader>Rolle erstellen</AntHeader>
    </template>
    <template #body>
      <EntityRoleEditRoleForm
        :role="role"
        :permissions="permissions.default"
        :loading="loading"
      />
    </template>
  </AntContent>
</template>
