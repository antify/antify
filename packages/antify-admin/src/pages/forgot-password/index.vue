<script lang="ts" setup>
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { validator } from '~~/glue/api/auth/forgot_password.post';

const { $auth } = useNuxtApp();

const _validator = reactive(validator);

const formData = ref<{ email: string }>({ email: '' });
const active = ref<boolean>(false);

const submit = async () => {
  _validator.validateProperty('email', formData.value.email, 1);

  if (_validator.hasErrors()) {
    return;
  }
  $auth.forgotPassword(formData.value.email);

  // Open Dialog to let user now that E-mail has ben sent and that he can close this window or go back to login
  active.value = true;
};

const resentMail = async () => {
  $auth.forgotPassword(formData.value.email);
};

onBeforeUnmount(() => {
  // Reset error maps
  _validator.errorMap = {};
});
</script>

<template>
  <div>
    <AntLoginLayout>
      <template #logo><span></span></template>
      <template #loginHeader>
        <AntHeader
          class="mt-6 mb-6 text-center text-3xl font-extrabold text-gray-900"
        >
          Passwort vergessen
        </AntHeader>

        <p class="text-gray-700 px-4">
          Sie haben Ihr Passwort vergessen? Kein Problem.<br />
          Geben Sie hier einfach Ihre E-Mail-Adresse ein.<br />
          Sie erhalten dann eine E-Mail zum zurücksetzen Ihres Passworts.
        </p>
      </template>

      <AntForm @submit.prevent="submit">
        <div data-cy="email">
          <AntInput
            v-model:value="formData.email"
            label="E-Mail"
            placeholder="E-Mail eingeben"
            :leadingIcon="faEnvelope"
            :is-error="
              _validator.errorMap['email'] &&
              _validator.errorMap['email'].length > 0
            "
            :errors="_validator.errorMap['email']"
            :validator="(val: string) => _validator.validateProperty('email', val, 1)"
          >
            <template #errorList="{ errors }">
              <div
                data-cy="error"
                v-for="error in errors"
                class="text-red-500"
              >
                {{ error }}
              </div>
            </template>
          </AntInput>
        </div>

        <div class="w-full flex justify-between">
          <AntButton data-cy="cancel">
            <nuxt-link :to="{ name: 'login' }"> Zurück </nuxt-link></AntButton
          >
          <AntButton
            data-cy="submit"
            type="submit"
            :primary="true"
          >
            Passwort zurücksetzen
          </AntButton>
        </div>
      </AntForm>
    </AntLoginLayout>

    <AntModal
      v-model:active="active"
      class="z-100"
    >
      <template #title>E-Mail Erfolgreich versendet</template>

      <div data-cy="modal">
        Bitte prüfen Sie Ihr E-Mail Postfach. <br />Es kann bis zu 5 Minuten
        dauern bis die E-Mail bei Ihnen ankommt, prüfen Sie gegebenen falls auch
        Ihren Spam-Ordner.
      </div>

      <template #buttons>
        <AntButton
          label="Schließen"
          @click="active = false"
          size="small"
        />

        <AntButton
          :primary="true"
          size="small"
        >
          <NuxtLink :to="{ name: 'login' }">zum Login</NuxtLink>
        </AntButton>

        <AntButton
          label="E-Mail erneut senden"
          :primary="true"
          @click="resentMail"
          size="small"
        />
      </template>
    </AntModal>
  </div>
</template>
