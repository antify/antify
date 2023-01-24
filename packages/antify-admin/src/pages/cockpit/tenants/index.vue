<script setup>
import TenantTable from '~~/components/pages/cockpit/tenant/TenantTable.vue';
import { ref } from 'vue';

const search = ref('');
</script>

<template>
  <AntContent>
    <template #head>
      <div class="flex justify-between items-center w-full space-x-8">
        <AntInput
          class="w-1/2"
          v-model:value="search"
          placeholder="Suche"
        />

        <AntButton :primary="true">
          <NuxtLink :to="{ name: 'cockpit-tenants-create' }">Create</NuxtLink>
        </AntButton>
      </div>
    </template>

    <template #body>
      <TenantTable />
    </template>
  </AntContent>
</template>
