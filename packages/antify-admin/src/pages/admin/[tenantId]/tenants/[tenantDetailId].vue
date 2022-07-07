<script setup lang="ts">
import { Response as GetResponse } from "~~/glue/api/tenants/[tenantDetailId].get";
import { validator as baseValidator, Response as PutResponse } from "~~/glue/api/tenants/[tenantDetailId].put";
import TenantLink from "~~/components/fields/TenantLink.vue";

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
const onSubmit = async () => {
  loading.value = true;
  errors.value = [];

  validator.value.validate(data.value.default, true);

  if (validator.value.hasErrors()) {
    loading.value = false;
    return;
  }

  const { data: response } = await useFetch<PutResponse>(
    `/api/tenants/${useRoute().params.tenantDetailId}`,
    {
      ...useDefaultFetchOpts(),
      ...{
        method: "PUT",
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
  <div>
    <ul data-cy="response-errors" v-if="errors.length" style="
        background: #dc2626;
        color: #fff;
        padding: 20px;
        list-style-position: inside;
      ">
      <li v-for="error in errors">{{ error }}</li>
    </ul>

    <form @submit.prevent="onSubmit">
      <div data-cy="name">
        <label>
          Bezeichnung <br />
          <input v-model="data.default.name" placeholder="Bezeichnung" autofocus
            @input="() => validator.validateProperty('name', data.default.name, true)" />
        </label>

        <div data-cy="error" v-for="message in validator.errorMap['name']">{{ message }}</div>
      </div>

      <TenantLink :to="{ name: 'admin-tenantId-tenants' }">Zurück</TenantLink> - 
      <button type="submit" data-cy="submit">Speichern</button>
    </form>
  </div>
</template>