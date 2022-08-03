<script setup>
import MailTemplatesTable from '~~/components/entity/mail-templates/MailTemplatesTable.vue';

const route = useRoute();
const router = useRouter();

const search = computed({
  get() {
    return route.query.search;
  },
  set(val) {
    router.push({
      name: route.name,
      query: {
        ...route.query,
        search: val,
      },
    });
  },
});
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
      <MailTemplatesTable />
    </template>
  </AntContent>
</template>
