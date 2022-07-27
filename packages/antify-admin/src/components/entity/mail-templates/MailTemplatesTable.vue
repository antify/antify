<script lang="ts" setup>
import { ANT_ROW_TYPES } from '@antify/antify-ui';
import TenantLink from '~~/components/fields/TenantLink.vue';
import { TableHeader } from '@antify/antify-ui/dist/types/TableHeader.type';

const route = useRoute();
const { data } = await useFetch(
  '/api/mail_templates/mail_templates',
  useDefaultFetchOpts()
);
const _data = computed(() => {
  return (data.value as Array<any>).map((template) => {
    if (route.params?.mailTemplateId === template.id) {
      return {
        ...template,
        active: true,
      };
    }

    return {
      ...template,
      active: false,
    };
  });
});

const tableHeader = ref<Array<TableHeader>>([
  {
    title: 'Name',
    identifier: 'title',
    type: ANT_ROW_TYPES.SLOT,
  },
]);
</script>

<template>
  <AntTable :headers="tableHeader" :data="_data">
    <template #cellContent="{ elem }">
      <TenantLink
        :to="{
          name: 'admin-tenantId-mail-templates-mailTemplateId',
          params: { mailTemplateId: elem.id },
        }"
      >
        {{ elem.title }}
      </TenantLink>
    </template>
  </AntTable>
</template>
