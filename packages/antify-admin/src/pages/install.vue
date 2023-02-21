<script setup lang="ts">
import { AppInstallRequiredResponse } from '../server/api/app/install_required.get';
import { AppInstallPostResponse } from '../glue/api/app/install.post';
import {
  appInstallPostValidator,
  AppInstallPostInput,
} from '~~/glue/api/app/install.post';

// Check if there is something to insall
const { data } = await useFetch<AppInstallRequiredResponse>(
  '/api/app/install_required',
  {
    headers: {
      'content-type': 'application/json',
    },
  }
);

if (!data.value.requireInstall) {
  await navigateTo({ name: 'login' });
}

const errors = ref([]);
const loading = ref<Boolean>(false);
const validator = ref(appInstallPostValidator);
const user = ref<AppInstallPostInput>({ name: '', email: '', password: '' });
const repeatPassword = ref('');

const passwordErrors = computed(() => {
  return validator.value.errorMap['password'] || [];
});

async function onSubmit() {
  loading.value = true;
  errors.value = [];

  validator.value.validate(user.value, 1);

  if (validator.value.hasErrors()) {
    loading.value = false;
    return;
  }

  const { data, error } = await useFetch<AppInstallPostResponse>(
    '/api/app/install',
    {
      method: 'POST',
      body: user.value,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  loading.value = false;

  if (data.value.default) {
    return await navigateTo({ name: 'cockpit' });
  }

  if (data.value.badRequest || data.value.installNotPossible) {
    errors.value =
      data.value.badRequest?.errors || data.value.installNotPossible.errors;

    user.value.name = '';
    user.value.email = '';
    user.value.password = '';
  }
}
</script>

<template>
  <AntContent>
    <template #head>
      <AntHeader>Install</AntHeader>
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

      <AntForm @submit.prevent="onSubmit">
        <div data-cy="name">
          <AntInput
            v-model:value="user.name"
            label="Name"
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

        <div data-cy="email">
          <AntInput
            v-model:value="user.email"
            label="E-Mail"
            :validator="(val: string) => validator.validateProperty('email', val, 1)"
            :errors="validator.errorMap['email']"
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

        <div data-cy="password">
          <AntPasswordField
            v-model:password="user.password"
            label="Passwort"
            :show-password="true"
            :validator="
              (val: string) => validator.validateProperty('password', val, 1)"
            :errors="passwordErrors"
          />
          <div
            class="sr-only"
            data-cy="error"
            v-for="message in validator.errorMap['password']"
          >
            {{ message }}
          </div>
        </div>

        <div data-cy="password-repeat">
          <AntPasswordField
            v-model:password="repeatPassword"
            label="Passwort wiederholen"
            :show-password="true"
          />
        </div>

        <template #footer>
          <AntButton
            :primary="true"
            data-cy="submit"
            type="submit"
          >
            Speichern
          </AntButton>
        </template>
      </AntForm>
    </template>
  </AntContent>
</template>
