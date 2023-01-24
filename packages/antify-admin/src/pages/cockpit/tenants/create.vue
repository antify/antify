<script lang="ts" setup>
import { Input, validator } from '~~/glue/api/cockpit/tenants/tenants.post';

const tenant = reactive<Input>({ name: '' });
const { $toaster } = useNuxtApp();

const onSubmit = async () => {
  useFetch('/api/pages/cockpit/tenants/tenants', {
    ...useDefaultFetchOpts(),
    method: 'POST',
    body: tenant,
  });

  $toaster.toastUpdated();
  await navigateTo({ name: 'cockpit-tenants' });
};
</script>

<template>
  <AntContent>
    <template #head>
      <AntHeader>Create tenant</AntHeader>
    </template>

    <template #body>
      <AntForm
        id="create-tenant-form"
        @submit.prevent="onSubmit"
      >
        <AntInput
          v-model:value="tenant.name"
          label="Name"
          :errors="validator.errorMap['name']"
          :is-error="
            validator.errorMap['name'] && validator.errorMap['name'].length > 0
          "
          :validator="(val: string) => validator.validateProperty('name', val, 1)"
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
      </AntForm>
    </template>

    <template #footer>
      <AntButton>
        <NuxtLink :to="{ name: 'cockpit-tenants' }">Back</NuxtLink>
      </AntButton>

      <AntButton
        :primary="true"
        type="submit"
        form="create-tenant-form"
      >
        Save
      </AntButton>
    </template>
  </AntContent>
</template>
