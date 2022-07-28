<script setup>
import TenantLink from '~~/components/fields/TenantLink.vue';

const { data: permissions } = await useFetch(
  '/api/roles/permissions',
  useDefaultFetchOpts()
);

const role = ref({
  name: '',
  permissions: [],
});
</script>

<template>
  <AntContent>
    <template #head>
      <AntHeader>Rolle erstellen</AntHeader>
    </template>

    <template #body>
      <EntityRoleEditRoleForm
        :role="role"
        :permissions="permissions"
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
