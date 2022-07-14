<script setup>
import TenantLink from '~~/components/fields/TenantLink.vue';

const { data: users } = await useFetch('/api/users/users', useDefaultFetchOpts());
</script>

<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>E-Mail</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>
            <TenantLink :to="{ name: 'admin-tenantId-users-userId', params: { userId: user.id } }">
              {{ user.name }}
            </TenantLink>
          </td>
          <td>
            {{ user.email }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>