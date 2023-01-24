<script setup lang="ts">
import {
  validator as baseValidator,
  Response as PutResponse,
} from '~~/glue/api/backoffice/[tenantId]/tenant/index.put';
import TenantTable from '~~/components/pages/cockpit/tenant/TenantTable.vue';
import { AntTabsType } from '@antify/antify-ui';

const { $toaster } = useNuxtApp();
const route = useRoute();

const errors = ref([]);
const loading = ref<Boolean>(true);
const saving = ref<Boolean>(false);
const validator = ref(baseValidator);
const search = ref('');
const deleteDialogActive = ref(false);
const tabs = ref<AntTabsType[]>([
  {
    name: 'Stammdaten',
    current: true,
    to: '',
  },
]);

const { data, refresh } = await useFetch(
  `/api/pages/cockpit/tenants/${route.params.tenantDetailId}`,
  {
    ...useDefaultFetchOpts(),
  }
);

const tenant = ref(data.value.default);
loading.value = false;

async function onSubmit() {
  saving.value = true;
  errors.value = [];

  validator.value.validate(tenant.value, 1);

  if (validator.value.hasErrors()) {
    saving.value = false;
    return;
  }

  const { data: response } = await useFetch<PutResponse>(
    `/api/pages/cockpit/tenants/${useRoute().params.tenantDetailId}`,
    {
      ...useDefaultFetchOpts(),
      ...{
        method: 'PUT',
        body: tenant.value,
      },
    }
  );

  saving.value = false;

  if (response.value.badRequest) {
    $toaster.toastError(response.value.badRequest.errors.join('\n'));
    return;
  }

  await refresh();
  $toaster.toastUpdated();
}

async function deleteTenant() {
  await useFetch<PutResponse>(
    `/api/pages/cockpit/tenants/${useRoute().params.tenantDetailId}`,
    {
      ...useDefaultFetchOpts(),
      ...{
        method: 'DELETE',
      },
    }
  );

  deleteDialogActive.value = false;
  $toaster.toastDeleted();

  await navigateTo({
    name: 'cockpit-tenants',
  });
}
</script>

<template>
  <div>
    <AntDualContent>
      <template #mainHead>
        <AntTabs :tabs="tabs" />

        <DeleteButton
          label="Delete"
          @click="deleteDialogActive = true"
        />
      </template>

      <template #mainBody>
        <ul
          data-cy="response-errors"
          v-if="errors.length"
          style="
            background: #dc2626;
            color: #fff;
            padding: 20px;
            list-style-position: inside;
          "
        >
          <li v-for="error in errors">{{ error }}</li>
        </ul>

        <AntForm
          @submit.prevent="onSubmit"
          id="edit-tenant-form"
        >
          <div data-cy="name">
            <AntInput
              v-model:value="tenant.name"
              label="Name"
              autofocus
              :validator="(val: string) => validator.validateProperty('name', val, 1)"
              :errors="validator.errorMap['name']"
              :loading="loading"
            >
              <template #errorList="{ errors }">
                <div
                  data-cy="error"
                  v-for="message in errors"
                  class="text-red-600"
                >
                  {{ message }}
                </div>
              </template>
            </AntInput>
          </div>
        </AntForm>
      </template>

      <template #mainFooter>
        <AntButton>
          <NuxtLink
            :to="{
              name: 'cockpit-tenants',
              query: route.query,
            }"
          >
            Back
          </NuxtLink>
        </AntButton>

        <AntButton
          :primary="true"
          type="submit"
          data-cy="submit"
          form="edit-tenant-form"
          :disabled="saving || loading"
        >
          Save
        </AntButton>
      </template>

      <template #asideHead>
        <AntInput
          v-model:value="search"
          placeholder="Suche"
        />
      </template>

      <template #asideBody>
        <TenantTable />
      </template>
    </AntDualContent>

    <AntModal
      v-model:active="deleteDialogActive"
      title="Delete tenant"
    >
      <div>Do you realy want to delete this tenant?</div>

      <template #buttons>
        <AntButton
          primary
          @click="deleteDialogActive = false"
        >
          Cancel
        </AntButton>

        <DeleteButton
          label="Delete"
          @click="deleteTenant"
        />
      </template>
    </AntModal>
  </div>
</template>
