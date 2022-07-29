<script
  lang="ts"
  setup
>
import { ANT_ROW_TYPES } from '@antify/antify-ui';
import TenantLink from '~~/components/fields/TenantLink.vue';
import { TableHeader } from '@antify/antify-ui/dist/types/TableHeader.type';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const route = useRoute();

const loading = ref<boolean>(true);
const tableHeader = ref<Array<TableHeader>>([
  {
    title: 'Name',
    identifier: 'title',
    type: ANT_ROW_TYPES.SLOT,
  },
]);

const { data } = await useFetch(
  '/api/mail_templates/mail_templates',
  useDefaultFetchOpts()
);

loading.value = false;

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
</script>

<template>
  <div>
    <AntTable
      :headers="tableHeader"
      :data="_data"
    >
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

      <template #emptyState>
        <td
          v-if="!loading"
          colspan="100"
          class="w-full py-2 text-center text-gray-500 text-2xl italic"
        >
          Nothing to see here jet!
        </td>

        <td v-else></td>
      </template>
    </AntTable>

    <Loader :loading="loading" />
  </div>
</template>
