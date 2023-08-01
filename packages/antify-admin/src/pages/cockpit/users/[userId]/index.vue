<script setup lang="ts">
import { validator as baseValidator } from '~~/glue/api/cockpit/users/[userId].put';

const route = useRoute();
const { $toaster } = useNuxtApp();

const errors = ref([]);
const loading = ref<Boolean>(true);
const saving = ref<Boolean>(false);

const validator = ref(baseValidator);

const userData = useUserDetailState();

loading.value = false;

onMounted(async () => {});

async function onSubmit() {
  saving.value = true;
  errors.value = [];

  validator.value.validate(userData.value.default, 1);

  if (validator.value.hasErrors()) {
    saving.value = false;

    return;
  }

  await useFetch(`/api/pages/cockpit/users/${route.params.userId}`, {
    ...useDefaultFetchOpts(),
    ...{
      method: 'PUT',
      body: userData.value.default,
    },
  });

  saving.value = false;

  $toaster.toastUpdated();
}
</script>

<template>
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
    <li
      v-for="(error, index) in errors"
      :key="`user-error-${index}`"
    >
      {{ error }}
    </li>
  </ul>

  <AntForm
    v-if="userData"
    @submit.prevent="onSubmit"
    class="flex flex-col bg-white"
    id="user-create-form"
  >
    <div data-cy="name">
      <AntInput
        v-model:value="userData.default.name"
        label="Name"
        :errors="validator.errorMap['name']"
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
    </div>

    <div data-cy="email">
      <AntInput
        v-model:value="userData.default.email"
        label="E-Mail"
        :errors="validator.errorMap['email']"
        :validator="(val: string) => validator.validateProperty('email', val, 1)"
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
