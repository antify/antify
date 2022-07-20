<script setup>
import { ref } from 'vue';
import UserTable from '~~/components/entity/user/UserTable.vue';

const search = ref('');
</script>

<template>
  <AntContent>
    <template #head>
      <AntInput v-model:value="search" placeholder="Suche" />
    </template>

    <template #body>
      <UserTable :single-col="false"></UserTable>
    </template>
  </AntContent>
</template>
