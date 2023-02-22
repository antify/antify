<script setup lang="ts">
import MailTemplatesTable from './MailTemplatesTable.vue';
import MainDataForm from './MainDataForm.vue';
import { AntTabsType } from '@antify/antify-ui';
import { LocationAsRelativeRaw } from 'vue-router';

// TODO:: on loading, the rich text editor get hidden. Implement loading state in antify ui's richtext editor and fix it here.

const props = defineProps<{
  context: string;
  tenantId?: string;
  getListingRoute: () => LocationAsRelativeRaw;
  getDetailRoute: (mailTemplateId: string) => LocationAsRelativeRaw;
}>();

const currentMailTemplateId = useRoute().params.mailTemplateId;
const search = ref('');
const tabs = ref<AntTabsType[]>([
  {
    name: 'Stammdaten',
    current: true,
    to: '',
  },
]);
</script>

<template>
  <div>
    <AntDualContent>
      <template #mainHead>
        <AntTabs :tabs="tabs" />
      </template>

      <template #mainBody>
        <MainDataForm
          :context="context"
          :tenant-id="tenantId"
          :mail-template-id="currentMailTemplateId"
          save-button-teleport-target="#mainFooterSaveBtn"
          :get-listing-route="getListingRoute"
          :get-detail-route="getDetailRoute"
        />
      </template>

      <template #mainFooter>
        <AntButton>
          <NuxtLink :to="getListingRoute()">Back</NuxtLink>
        </AntButton>

        <div id="mainFooterSaveBtn"></div>
      </template>

      <template #asideHead>
        <AntInput
          v-model:value="search"
          placeholder="Search"
        />
      </template>

      <template #asideBody>
        <MailTemplatesTable
          :active="currentMailTemplateId"
          :get-detail-route="getDetailRoute"
          :context="context"
          :tenant-id="tenantId"
        />
      </template>
    </AntDualContent>
  </div>
</template>
