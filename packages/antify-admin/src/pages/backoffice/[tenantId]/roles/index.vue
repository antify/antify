<script setup>
import TenantLink from '~~/components/fields/TenantLink.vue';
import RoleTable from '~~/components/entity/role/RoleTable.vue';

const search = ref('');
</script>

<template>
  <AntContent>
    <template #head>
      <AntInput
        v-model:value="search"
        placeholder="Search"
      />

      <AntButton :primary="true">
        <TenantLink :to="{ name: 'backoffice-tenantId-roles-create' }">
          Create
        </TenantLink>
      </AntButton>
    </template>

    <template #body>
      <RoleTable />
    </template>
  </AntContent>
</template>
