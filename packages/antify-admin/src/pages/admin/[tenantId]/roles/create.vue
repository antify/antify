<script
  setup
  lang="ts"
>
import { permissions } from '../../../../server/datasources/static/permissions';
import TenantLink from '~~/components/fields/TenantLink.vue';

const loading = ref(true);
const role = ref<{
  id?: string;
  name: string;
  isAdmin: boolean;
  permissions: string[];
  canDelete: boolean;
}>({
  name: '',
  isAdmin: false,
  permissions: [],
  canDelete: false,
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
        id="create-role-form"
      />
    </template>

    <template #footer>
      <AntButton>
        <TenantLink :to="{ name: 'admin-tenantId-roles' }">Zurück</TenantLink>
      </AntButton>

      <AntButton
        :primary="true"
        type="submit"
        form="create-role-form"
      >
        Speichern
      </AntButton>
    </template>
  </AntContent>
</template>
