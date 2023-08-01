<script lang="ts" setup>
import { ANT_ROW_TYPES } from '@antify/antify-ui';
import { TableHeader } from '@antify/antify-ui/dist/types/TableHeader.type';
import { Response } from '~~/glue/api/tenants/tenants.get';

const route = useRoute();
const router = useRouter();

const itemsPerPage = ref(20);

const page = computed<number>({
  get() {
    return parseInt(route.query.page as string, 10) || 1;
  },
  set(val) {
    router.push({
      name: route.name,
      query: {
        ...route.query,
        page: val,
      },
    });
  },
});

const { data, pending } = await useFetch<Response>(
  () =>
    `/api/components/pages/cockpit/tenants/tenant-table?page=${page.value}&itemsPerPage=${itemsPerPage.value}`,
  useDefaultFetchOpts()
);

const _data = computed(() => {
  return data.value?.default.data.map((tenant) => {
    if (route.params?.tenantDetailId === tenant.id) {
      return {
        ...tenant,
        active: true,
      };
    }

    return {
      ...tenant,
      active: false,
    };
  });
});

const tableHeaders = ref<Array<TableHeader>>([
  {
    title: 'name',
    identifier: 'name',
    type: ANT_ROW_TYPES.SLOT,
  },
]);

function prev() {
  if (page.value > 1) {
    page.value--;
  }
}

function next() {
  if (page.value < data.value.default?.pagination.count) {
    page.value++;
  }
}
</script>

<template>
  <div class="h-full flex flex-col justify-between">
    <div class="overflow-auto">
      <AntTable
        :headers="tableHeaders"
        :data="_data"
        :loading="pending"
      >
        <template #cellContent="{ elem }">
          <NuxtLink
            class="w-full block"
            :to="{
              name: 'cockpit-tenants-tenantDetailId',
              params: { tenantDetailId: elem.id },
              query: { ...route.query },
            }"
          >
            {{ elem.name }}
          </NuxtLink>
        </template>
      </AntTable>
    </div>

    <AntPagination>
      <template #position
        >Seite {{ page }} von {{ data.default.pagination.count }}</template
      >

      <template #buttons>
        <AntButton
          :disabled="page === 1"
          class="disabled:cursor-not-allowed disabled:opacity-50"
          @click="prev"
        >
          Zurück
        </AntButton>

        <AntButton
          @click="next"
          :disabled="page >= data.default?.pagination.count"
          class="disabled:cursor-not-allowed disabled:opacity-50"
        >
          Weiter
        </AntButton>
      </template>
    </AntPagination>
  </div>
</template>
