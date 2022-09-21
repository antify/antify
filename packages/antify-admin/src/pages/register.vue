<script
  lang="ts"
  setup
>
import {
  validator as registerValidator,
  Input,
} from '~~/glue/api/auth/register.post';

const { $auth } = useNuxtApp();
const route = useRoute();

const errors = ref([]);
const formData = ref<Input>({
  email: '',
  password: '',
  token: route.query.inviteToken as string,
});
const repeatPassword = ref('');

const validator = reactive(registerValidator);

const validateErrors = computed<string[]>(() => {
  return [...validator.getErrors(), ...errors.value];
});

async function submit() {
  errors.value = [];

  validator.validate(
    { ...formData.value, repeatPassword: repeatPassword.value },
    1
  );

  if (validator.hasErrors()) {
    return;
  }

  const { data, error } = await $auth.register(
    formData.value.email,
    formData.value.password,
    formData.value.token
  );

  if (error.value) {
    return throwError('Uuups something went wrong');
  }

  if (data.value.default) {
    await navigateTo({ name: 'backoffice' });
  }
}
</script>

<template>
  <AntLoginLayout>
    <template #logo><span></span></template>
    <template #loginHeader>
      <AntHeader class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Registrieren
      </AntHeader>
    </template>

    <AntForm @submit.prevent="submit">
      <div data-cy="email">
        <AntInput
          v-model:value="formData.email"
          label="E-Mail"
          :is-error="
            validator.errorMap['email'] &&
            validator.errorMap['email'].length > 0
          "
          :validator="(val: string) => validator.validateProperty('email', val, 1)"
        />
      </div>

      <div data-cy="password">
        <AntPasswordField
          v-model:password="formData.password"
          label="Passwort"
          :is-error="
            validator.errorMap['password'] &&
            validator.errorMap['password'].length > 0
          "
          :validator="(val: string) => validator.validateProperty('password', val, 1)"
          :show-password="true"
        />
      </div>

      <div data-cy="repeatPassword">
        <AntPasswordField
          v-model:password="repeatPassword"
          label="Passwort wiederholen"
          :is-error="
            validator.errorMap['repeatPassword'] &&
            validator.errorMap['repeatPassword'].length > 0
          "
          :errors="validator.errorMap['repeatPassword']"
          :validator="(val: string) => validator.validateProperty('repeatPassword', val, 1)"
          :show-password="true"
        />
      </div>

      <template #error="param">
        <div data-cy="login-errors">
          {{ param.error }}
        </div>
      </template>

      <template #footer>
        <AntButton
          data-cy="cancel"
          :primary="true"
        >
          <NuxtLink :to="{ name: 'login' }">zum Login</NuxtLink>
        </AntButton>

        <AntButton
          type="submit"
          data-cy="submit"
          :primary="true"
        >
          Registrieren
        </AntButton>
      </template>
    </AntForm>
  </AntLoginLayout>
</template>
