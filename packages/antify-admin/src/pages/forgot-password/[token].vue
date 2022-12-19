<script lang="ts" setup>
import { validator } from '~~/glue/api/auth/new_password.post';

const route = useRoute();
const router = useRouter();
const _validator = reactive(validator);
const { $auth } = useNuxtApp();

const formData = ref<{
  password: string;
  repeatPassword: string;
}>({
  password: '',
  repeatPassword: '',
});

const errors = ref([]);

const submit = async () => {
  errors.value = [];

  _validator.validate(formData.value, 1);

  if (_validator.hasErrors()) {
    return;
  }

  await $auth.newPassword(
    route.params.token as string,
    formData.value.password
  );

  // Return to login
  router.push({ name: 'login' });
};
</script>

<template>
  <AntLoginLayout>
    <template #logo><span></span></template>
    <template #loginHeader>
      <AntHeader
        class="mt-6 mb-6 text-center text-3xl font-extrabold text-gray-900"
      >
        Passwort vergessen
      </AntHeader>

      <p class="text-gray-700 px-4">Geben Sie hier Ihr neues Passwort ein</p>
    </template>

    <AntForm @submit.prevent="submit">
      <div data-cy="password">
        <AntPasswordField
          v-model:password="formData.password"
          label="Passwort"
          placeholder="Neues Passwort"
          :is-error="
            _validator.errorMap['password'] &&
            _validator.errorMap['password'].length > 0
          "
          :errors="_validator.errorMap['password']"
          :validator="(val: string) => _validator.validateProperty('password', val, 1)"
        >
          <template #errorList="{ errors }">
            <div data-cy="error" v-for="error in errors" class="text-red-500">
              {{ error }}
            </div>
          </template>
        </AntPasswordField>
      </div>

      <div data-cy="repeatPassword">
        <AntPasswordField
          v-model:password="formData.repeatPassword"
          label="Passwort wiederholen"
          placeholder="Neues Passwort wiederholen"
          :is-error="
            _validator.errorMap['repeatPassword'] &&
            _validator.errorMap['repeatPassword'].length > 0
          "
          :errors="_validator.errorMap['repeatPassword']"
          :validator="(val: string) => _validator.validateProperty('repeatPassword', val, 1)"
        >
          <template #errorList="{ errors }">
            <div data-cy="error" v-for="error in errors" class="text-red-500">
              {{ error }}
            </div>
          </template>
        </AntPasswordField>
      </div>

      <div class="w-full flex justify-between">
        <AntButton data-cy="cancel">
          <nuxt-link :to="{ name: 'login' }"> Zurück </nuxt-link>
        </AntButton>

        <AntButton data-cy="submit" type="submit" :primary="true">
          Passwort zurücksetzen
        </AntButton>
      </div>
    </AntForm>
  </AntLoginLayout>
</template>
