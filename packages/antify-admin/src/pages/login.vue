<script
  setup
  lang="ts"
>
import { routeLocationKey } from 'vue-router';
import {
  authLoginPostValidator,
  AuthLoginPostInput,
} from '~~/glue/api/auth/login.post';

definePageMeta({
  middleware: () => {
    if (useNuxtApp().$auth.getGuard().isUserLoggedIn) {
      return { name: 'admin' };
    }
  },
});

const { $auth } = useNuxtApp();
const route = useRoute();

const isDev = process.env.NODE_ENV === 'development';
const errors = ref([]);
const formData = ref<AuthLoginPostInput>({
  email: isDev ? 'admin@admin.de' : '',
  password: isDev ? 'admin' : '',
  token: route.query?.inviteToken as string,
});
const loading = ref<Boolean>(false);

const validator = reactive(authLoginPostValidator);

const validateErrors = computed<string[]>(() => {
  return [...validator.getErrors(), ...errors.value];
});

async function onLogin() {
  loading.value = true;
  errors.value = [];

  validator.validate(formData.value, 1);

  if (validator.hasErrors()) {
    loading.value = false;
    return;
  }

  // TODO:: handle server error (error property)
  const { data, error } = await $auth.login(
    formData.value.email,
    formData.value.password,
    formData.value.token
  );
  loading.value = false;

  if (error.value) {
    // return throwError('Uuups something went wrong');
    errors.value.push(error.value);
    return;
  }

  if (data.value.default) {
    await navigateTo({ name: 'admin' });
  }

  if (
    data.value.badRequest ||
    data.value.invalidCredentials ||
    data.value.banned
  ) {
    errors.value =
      data.value.badRequest?.errors ||
      data.value.invalidCredentials?.errors ||
      data.value.banned?.errors;

    formData.value.password = '';
  }
}

onBeforeUnmount(() => {
  // Reset error maps
  validator.errorMap = {};
});
</script>

<template>
  <AntLoginLayout>
    <template #logo><span></span></template>
    <template #loginHeader>
      <AntHeader class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Login
      </AntHeader>
    </template>

    <AntLoginWidget
      @submit.prevent="onLogin"
      :errors="validateErrors"
    >
      <template #emailField>
        <div data-cy="email">
          <AntInput
            v-model:value="formData.email"
            class="rounded-none relative block rounded-t-md focus:z-10"
            placeholder="Email"
            :is-error="
              validator.errorMap['email'] &&
              validator.errorMap['email'].length > 0
            "
            :validator="(val: string) => validator.validateProperty('email', val, 1)"
          />
        </div>
      </template>

      <template #passwordField>
        <div data-cy="password">
          <AntPasswordField
            v-model:password="formData.password"
            class="rounded-none block rounded-b-md focus:z-10"
            placeholder="password"
            :is-error="
              validator.errorMap['password'] &&
              validator.errorMap['password'].length > 0
            "
            :validator="(val: string) => validator.validateProperty('password', val, 1)"
            :show-password="true"
          />
        </div>
      </template>

      <template #error="param">
        <div data-cy="login-errors">
          {{ param.error }}
        </div>
      </template>

      <template #beforeSubmit>
        <div class="flex justify-end w-full text-blue-500 text-sm">
          <NuxtLink :to="{ name: 'forgotPassword' }">
            Passwort vergessen?
          </NuxtLink>
        </div>
      </template>

      <template #submitButton>
        <AntButton
          type="submit"
          data-cy="submit"
          :primary="true"
        >
          Login
        </AntButton>
      </template>
    </AntLoginWidget>
  </AntLoginLayout>
</template>
