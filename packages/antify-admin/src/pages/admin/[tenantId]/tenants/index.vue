<script setup>
import TenantLink from "~~/components/fields/TenantLink.vue";
import { ROW_TYPES } from "@antify/antify-ui";

const { data } = await useFetch("/api/tenants/tenants", useDefaultFetchOpts());

const tableHeaders = [
  {
    title: "name",
    identifier: "name",
    type: ROW_TYPES.SLOT,
  },
];
</script>

<template>
  <AntContent>
    <template #head>
      <AntHeader>Mandanten</AntHeader>
    </template>

    <template #body>
      <AntTable :headers="tableHeaders" :data="data.default">
        <template #cellContent="{ elem }">
          <TenantLink
            :to="{
              name: 'admin-tenantId-tenants-tenantDetailId',
              params: { tenantDetailId: elem.id },
            }"
          >
            {{ elem.name }}
          </TenantLink>
        </template>
      </AntTable>
    </template>
  </AntContent>
</template>
