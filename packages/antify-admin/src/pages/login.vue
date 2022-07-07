<script setup lang="ts">
import { authLoginPostValidator, AuthLoginPostInput } from "~~/glue/api/auth/login.post";

definePageMeta({
  middleware: () => {
    if (useNuxtApp().$auth.getGuard().isUserLoggedIn) {
      return { name: 'admin' };
    }
  }
});

const { $auth } = useNuxtApp();
const errors = ref([]);

const isDev = process.env.NODE_ENV === 'development';
const formData = ref<AuthLoginPostInput>({
  email: isDev ? 'admin@admin.de' : '',
  password: isDev ? 'admin' : ''
});
const loading = ref<Boolean>(false);
const validator = ref(authLoginPostValidator)
const onLogin = async () => {
  loading.value = true;
  errors.value = [];

  validator.value.validate(formData.value, true);

  if (validator.value.hasErrors()) {
    loading.value = false;
    return;
  }

  // TODO:: handle server error (error property)
  const { data, error } = await $auth.login(formData.value.email, formData.value.password);
  loading.value = false;

  if (error.value) {
    return throwError('Uuups something went wrong');
  }

  if (data.value.default) {
    await navigateTo({ name: 'admin' });
  }

  if (data.value.badRequest || data.value.invalidCredentials) {
    errors.value = data.value.badRequest?.errors || data.value.invalidCredentials.errors;

    formData.value.email = '';
    formData.value.password = '';
  }
}
</script>

<template>
  <div>
    <h1>Login</h1>

    <ul data-cy="response-errors" v-if="errors.length"
      style="background: #dc2626; color: #fff; padding: 20px; list-style-position: inside;">
      <li v-for="error in errors">{{ error }}</li>
    </ul>

    <form @submit.prevent="onLogin">
      <div data-cy="email">
        <input type="text" v-model="formData.email" placeholder="E-Mail" autofocus
          @input="() => validator.validateProperty('email', formData.email, true)" />

        <div data-cy="error" v-for="message in validator.errorMap['email']">{{ message }}</div>
      </div>

      <div data-cy="password">
        <input type="password" v-model="formData.password" placeholder="Password"
          @input="() => validator.validateProperty('password', formData.password, true)" />

        <div data-cy="error" v-for="message in validator.errorMap['password']">{{ message }}</div>
      </div>

      <button type="submit" data-cy="submit">Login</button>
    </form>
  </div>
</template>
