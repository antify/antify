<script setup>
import TenantTable from '~~/components/entity/tenant/TenantTable.vue';
import { ref } from 'vue';
const search = ref('');
</script>

<template>
  <AntContent>
    <template #head>
      <AntInput
        v-model:value="search"
        placeholder="Suche"
      />
    </template>

    <template #body>
      <TenantTable />
    </template>
  </AntContent>
</template>
