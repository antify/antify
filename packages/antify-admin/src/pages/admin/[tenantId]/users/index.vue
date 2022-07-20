<script setup>
import { ROW_TYPES } from "@antify/antify-ui";
import TenantLink from "~~/components/fields/TenantLink.vue";

const { data: users } = await useFetch(
  "/api/users/users",
  useDefaultFetchOpts()
);
// TODO: use ROW_TYPES from antify-ui
const tableHeaders = [
  {
    title: "Name",
    identifier: "name",
    headerClass: "font-bold",
    type: ROW_TYPES.SLOT,
  },
  {
    title: "E-Mail",
    identifier: "email",
    headerClass: "font-bold",
    type: ROW_TYPES.TEXT,
  },
];
</script>

<template>
  <AntContent>
    <template #head>
      <AntHeader class="px-4 py-3.5">Benutzer</AntHeader>
    </template>

    <template #body>
      <div class="h-screen">
        <AntTable :headers="tableHeaders" :data="users">
          <template #cellContent="{ elem }">
            <TenantLink
              :to="{
                name: 'admin-tenantId-users-userId',
                params: { userId: elem.id },
              }"
            >
              {{ elem.name }}
            </TenantLink>
          </template>
        </AntTable>
      </div>
      <!-- <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>E-Mail</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>
              <TenantLink
                :to="{
                  name: 'admin-tenantId-users-userId',
                  params: { userId: user.id },
                }"
              >
                {{ user.name }}
              </TenantLink>
            </td>
            <td>
              {{ user.email }}
            </td>
          </tr>
        </tbody>
      </table> -->
    </template>
  </AntContent>
</template>
