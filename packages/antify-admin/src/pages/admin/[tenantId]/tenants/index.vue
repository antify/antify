<script setup>
import TenantLink from '~/components/fields/TenantLink.vue';

const { data } = await useFetch('/api/tenants/tenants', useDefaultFetchOpts());
</script>

<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tenant in data.default" :key="tenant.id">
          <td>
            <TenantLink :to="{ name: 'admin-tenantId-tenants-tenantDetailId', params: { tenantDetailId: tenant.id } }">
              {{ tenant.name }}
            </TenantLink>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>