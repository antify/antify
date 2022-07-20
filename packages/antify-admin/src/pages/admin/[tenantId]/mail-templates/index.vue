<script setup>
import MailTemplatesTable from '~~/components/entity/mail-templates/MailTemplatesTable.vue';
import { ref } from 'vue';

const search = ref('');
</script>

<template>
  <AntContent>
    <template #head>
      <AntInput v-model:value="search" placeholder="Suche" />
    </template>

    <template #body>
      <MailTemplatesTable />
    </template>
  </AntContent>
</template>
