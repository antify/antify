<script setup lang='ts'>
import { ANT_ROW_TYPES } from '@antify/antify-ui';
// TODO:: Fix this
import { TableHeader } from '@antify/antify-ui/dist/types/TableHeader.type';
import { LocationAsRelativeRaw } from 'vue-router';
import { useContextHeader, useTenantHeader } from '@antify/context';

const props = defineProps<{
  context: string;
  tenantId?: string;
  active?: string;
  getDetailRoute: (mailTemplateId: string) => LocationAsRelativeRaw;
}>();

const router = useRouter();
const tableHeader = ref<Array<TableHeader>>([
  {
    title: 'Title',
    identifier: 'title',
    type: ANT_ROW_TYPES.SLOT
  }
]);

const { data, error, status, execute, pending } = useFetch(
  `/api/mailer-module/mail-templates-table`,
  {
    headers: {
      ...useContextHeader(props.context),
      ...useTenantHeader(props.tenantId)
    },
    immediate: false
  }
);

onMounted(() => execute());

const _data = computed(() => {
  return (
    data?.value?.default?.map((template) => {
      if (props.active === template.mailTemplateId) {
        return {
          ...template,
          active: true
        };
      }

      return {
        ...template,
        active: false
      };
    }) || []
  );
});
</script>

<template>
  <div>
    <AntTable
      :headers='tableHeader'
      :data='_data'
      :loading='["idle", "pending"].includes(status)'
    >
      <template #cellContent='{ elem }'>
        <div
          @click='router.push(getDetailRoute(elem.mailTemplateId))'
          class='cursor-pointer'
        >
          {{ elem.title }}
        </div>
      </template>

      <template #emptyState>
        <td
          colspan='100'
          class='w-full py-2 text-center text-gray-500 text-2xl italic'
        >
          Nothing to see here jet!
        </td>
      </template>
    </AntTable>
  </div>
</template>
