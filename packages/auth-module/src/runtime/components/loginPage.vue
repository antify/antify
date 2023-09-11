<script setup lang="ts">
import { validator as _validator, Input } from '../glue/login.post';
import { LocationAsRelativeRaw } from 'vue-router';
import { useContextHeader, useTenantHeader } from '@antify/context';

// definePageMeta({
//   middleware: () => {
//     if (useNuxtApp().$auth.getGuard().isUserLoggedIn) {
//       return { name: 'backoffice' };
//     }
//   },
// });

const props = defineProps<{
  tenantId?: string;
  context: string;
  forgotPasswordRoute: LocationAsRelativeRaw;
}>();
const emit = defineEmits(['login']);

const route = useRoute();

// TODO:: use runtime config
const isDev = process.env.NODE_ENV === 'development';
const errors = ref([]);
const formData = ref<Input>({
  email: isDev ? 'admin@admin.de' : '',
  password: isDev ? 'admin' : '',
  token: route.query?.inviteToken as string,
});
const loading = ref<Boolean>(false);

const validator = reactive(_validator);

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

  const { data, error } = await useFetch('/api/auth-module/login', {
    method: 'post',
    body: {
      email: formData.value.email,
      password: formData.value.password,
      token: formData.value.token,
    },
    headers: {
      ...useContextHeader(props.context),
      ...useTenantHeader(props.tenantId),
    },
  });
  loading.value = false;

  if (error.value) {
    throw createError({ ...error.value, fatal: true });
  }

  if (data.value.success) {
    return emit('login');
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
          <NuxtLink :to="forgotPasswordRoute">Forgot password?</NuxtLink>
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
