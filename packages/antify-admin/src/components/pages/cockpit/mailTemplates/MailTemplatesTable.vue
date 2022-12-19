<script lang="ts" setup>
import { ANT_ROW_TYPES } from '@antify/antify-ui';
// TODO:: export correct way
import { TableHeader } from '@antify/antify-ui/dist/types/TableHeader.type';

const router = useRouter();
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
  '/api/components/pages/cockpit/mail-templates/mail-templates-table',
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

function goToDetail(id: string) {
  router.push({
    name: 'cockpit-mail-templates-mailTemplateId',
    params: { mailTemplateId: id },
  });
}
</script>

<template>
  <div>
    <AntTable
      :headers="tableHeader"
      :data="_data"
    >
      <template #cellContent="{ elem }">
        <div
          @click="goToDetail(elem.id)"
          class="cursor-pointer"
        >
          {{ elem.title }}
        </div>
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
  </div>
</template>
