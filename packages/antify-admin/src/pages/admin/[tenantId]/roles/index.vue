<script setup>
import TenantLink from "~~/components/fields/TenantLink.vue";
import { ROW_TYPES } from "@antify/antify-ui";

const { data: roles } = await useFetch(
  "/api/roles/roles",
  useDefaultFetchOpts()
);

const tableHeaders = [
  {
    title: "Rollen",
    identifier: "name",
    type: ROW_TYPES.SLOT,
  },
];
</script>

<template>
  <AntContent>
    <template #head>
      <AntHeader class="">Rollen</AntHeader>

      <AntButton :primary="true" class="">
        <TenantLink :to="{ name: 'admin-tenantId-roles-create' }">
          Hinzufügen
        </TenantLink>
      </AntButton>
    </template>

    <template #body>
      <AntTable :headers="tableHeaders" :data="roles">
        <template #cellContent="{ elem }">
          <TenantLink
            :to="{
              name: 'admin-tenantId-roles-roleId',
              params: { roleId: elem.id },
            }"
          >
            {{ elem.name }}
          </TenantLink>
        </template>
      </AntTable>
    </template>
  </AntContent>
</template>
