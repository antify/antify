<script setup>
import TenantLink from '~/components/fields/TenantLink.vue';

const { data } = await useFetch('/api/mail_templates/mail_templates', useDefaultFetchOpts());
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
        <tr v-for="mailTemplate in data" :key="mailTemplate.id">
          <td>
            <TenantLink :to="{ name: 'admin-tenantId-mail-templates-mailTemplateId', params: { mailTemplateId: mailTemplate.id } }">
              {{ mailTemplate.title }}
            </TenantLink>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>