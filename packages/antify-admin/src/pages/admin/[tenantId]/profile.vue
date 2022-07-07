<script setup lang="ts">
import { Response as GetResponse } from "~~/glue/api/profile/user.get";
import { validator as baseValidator, Response as PutResponse } from "~~/glue/api/profile/user.put";

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

  validator.value.validate(data.value.default, true);

  if (validator.value.hasErrors()) {
    loading.value = false;
    return;
  }

  const { data: response } = await useFetch<PutResponse>(
    `/api/profile/user`,
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
          Name <br />
          <input v-model="data.default.name" placeholder="Name" autofocus
            @input="() => validator.validateProperty('name', data.default.name, true)" />
        </label>

        <div data-cy="error" v-for="message in validator.errorMap['name']">{{ message }}</div>
      </div>

      <div data-cy="email">
        <label>
          E-Mail <br />
          <input v-model="data.default.email" placeholder="E-Mail"
            @input="() => validator.validateProperty('email', data.default.email, true)" />
        </label>

        <div data-cy="error" v-for="message in validator.errorMap['email']">{{ message }}</div>
      </div>

      <div>
        TODO:: Profile photo
      </div>

      <div>
        TODO:: Profile password
      </div>

      <button type="submit" data-cy="submit">Speichern</button>
    </form>
  </div>
</template>