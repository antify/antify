<script setup lang="ts">
import MailTemplatesTable from './MailTemplatesTable.vue';
import { LocationAsRelativeRaw } from 'vue-router';

defineProps<{
  context: string;
  tenantId?: string;
  getDetailRoute: (mailTemplateId: string) => LocationAsRelativeRaw;
}>();
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
        placeholder="Search"
      />
    </template>

    <template #body>
      <MailTemplatesTable
        :get-detail-route="getDetailRoute"
        :context="context"
        :tenant-id="tenantId"
      />
    </template>
  </AntContent>
</template>
