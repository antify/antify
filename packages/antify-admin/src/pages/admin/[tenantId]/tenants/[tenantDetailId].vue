<script setup lang="ts">
import { Response as GetResponse } from '~~/glue/api/tenants/[tenantDetailId].get';
import {
  validator as baseValidator,
  Response as PutResponse,
} from '~~/glue/api/tenants/[tenantDetailId].put';
import TenantLink from '~~/components/fields/TenantLink.vue';
import TenantTable from '~~/components/entity/tenant/TenantTable.vue';

const { data } = await useFetch<GetResponse | PutResponse>(
  `/api/tenants/${useRoute().params.tenantDetailId}`,
  useDefaultFetchOpts()
);

// if (!data.value?.default) {
//   // TODO:: Handle it
//   throw throwError('HANDLE ME');
// }

const { $toaster } = useNuxtApp();

const errors = ref([]);
const loading = ref<Boolean>(false);
const validator = ref(baseValidator);
const search = ref('');

const onSubmit = async () => {
  loading.value = true;
  errors.value = [];

  validator.value.validate(data.value.default, 1);

  if (validator.value.hasErrors()) {
    loading.value = false;
    return;
  }

  const { data: response } = await useFetch<PutResponse>(
    `/api/tenants/${useRoute().params.tenantDetailId}`,
    {
      ...useDefaultFetchOpts(),
      ...{
        method: 'PUT',
        body: data.value.default,
      },
    }
  );
  loading.value = false;

  if (response.value.default) {
    data.value = response.value;
    $toaster.toastUpdated();
  }

  if (response.value.badRequest) {
    $toaster.toastError(response.value.badRequest.errors.join('\n'));
  }
};
</script>

<template>
  <AntDualContent>
    <template #mainHead>
      <AntHeader>Mandant bearbeiten</AntHeader>
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

      <AntForm @submit.prevent="onSubmit">
        <div data-cy="name">
          <AntInput
            v-model:value="data.default.name"
            label="Bezeichnung"
            autofocus
            :validator="(val: string) => validator.validateProperty('name', val, 1)"
            :errors="validator.errorMap['name']"
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

        <template #footer>
          <AntButton>
            <TenantLink :to="{ name: 'admin-tenantId-tenants' }">
              Zurück
            </TenantLink>
          </AntButton>

          <AntButton :primary="true" type="submit" data-cy="submit">
            Speichern
          </AntButton>
        </template>
      </AntForm>
    </template>

    <template #asideHead>
      <AntInput v-model:value="search" placeholder="Suche" />
    </template>
    <template #asideBody><TenantTable /></template>
  </AntDualContent>
</template>
