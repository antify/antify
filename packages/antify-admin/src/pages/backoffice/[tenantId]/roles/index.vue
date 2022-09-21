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
        placeholder="Suche"
      />

      <AntButton
        :primary="true"
        class=""
      >
        <TenantLink :to="{ name: 'backoffice-tenantId-roles-create' }">
          Hinzufügen
        </TenantLink>
      </AntButton>
    </template>

    <template #body>
      <RoleTable />
    </template>
  </AntContent>
</template>
