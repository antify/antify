<script setup lang="ts">
import { Response as GetResponse } from '~~/glue/api/profile/user.get';
import {
  validator as baseValidator,
  Response as PutResponse,
} from '~~/glue/api/profile/user.put';

const { data } = await useFetch<GetResponse | PutResponse>(
  `/api/profile/user`,
  useDefaultFetchOpts()
);

const { $toaster } = useNuxtApp();
const errors = ref([]);
const loading = ref<Boolean>(false);
const validator = ref(baseValidator);
const onSubmit = async () => {
  loading.value = true;
  errors.value = [];

  validator.value.validate(data.value.default, 1);

  if (validator.value.hasErrors()) {
    loading.value = false;
    return;
  }

  const { data: response } = await useFetch<PutResponse>(`/api/profile/user`, {
    ...useDefaultFetchOpts(),
    ...{
      method: 'PUT',
      body: data.value.default,
    },
  });
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
  <AntContent>
    <template #head>
      <AntHeader>Profil</AntHeader>
    </template>

    <template #body>
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

      <form class="px-4 py-4 space-y-4" @submit.prevent="onSubmit">
        <div data-cy="name">
          <AntInput
            v-model:value="data.default.name"
            :label="'Name'"
            autofocus
            :errors="validator.errorMap['name']"
            :validator="
              (val: string) => validator.validateProperty('name', val, 1)
            "
          />
        </div>

        <div data-cy="email">
          <AntInput
            v-model:value="data.default.email"
            :label="'E-Mail'"
            autofocus
            :errors="validator.errorMap['email']"
            :is-error="
              validator.errorMap['email'] &&
              validator.errorMap['email'].length > 0
            "
            :validator="
              (val: string) => validator.validateProperty('email', val, 1)
            "
          />
        </div>

        <div>TODO:: Profile photo</div>

        <div>TODO:: Profile password</div>

        <AntButton type="submit" data-cy="submit" :primary="true">
          Speichern
        </AntButton>
      </form>
    </template>
  </AntContent>
</template>
