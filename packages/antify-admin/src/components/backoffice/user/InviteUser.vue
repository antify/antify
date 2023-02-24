<script lang="ts" setup>
import { AntSelectOption } from '@antify/antify-ui';
import { ref } from 'vue';
import { validator as _inviteValidator } from '~~/glue/api/users/invite_user.post';
import { Response as RolesResponse } from '~~/glue/api/backoffice/[tenantId]/roles/roles.get';

const { $toaster } = useNuxtApp();
const inviteValidator = reactive(_inviteValidator);
const inviteUserActive = ref(false);
const inviteEmail = ref('');
const inviteAs = ref('');

const { data: roles } = await useFetch<RolesResponse>(
  '/api/roles/roles',
  useDefaultFetchOpts()
);

const options = computed<AntSelectOption[]>(() => {
  return roles.value.default.map((role) => ({
    label: role.name,
    value: role.id,
  }));
});

async function inviteUser() {
  inviteValidator.validate(
    { email: inviteEmail.value, roleId: inviteAs.value },
    1
  );

  if (inviteValidator.getErrors()?.length > 0) {
    return;
  }

  await useFetch(`/api/users/invite_user`, {
    method: 'POST',
    body: {
      email: inviteEmail.value,
      roleId: inviteAs.value,
    },
  });

  $toaster.toastSuccess('Einladung wurde versendet');
  inviteUserActive.value = false;
}
</script>

<template>
  <AntModal
    v-model:active="inviteUserActive"
    title="Invite User"
  >
    <AntForm
      id="invite-user-form"
      @submit.prevent="inviteUser"
    >
      <AntInput
        v-model:value="inviteEmail"
        label="Mail"
        data-cy="invite-email"
        description="Geben Sie die E-Mail-Adresse des Nutzers ein den Sie einladen möchten"
        :errors="inviteValidator.errorMap['email']"
        :is-error="
          inviteValidator.errorMap['email'] &&
          inviteValidator.errorMap['email'].length > 0
        "
        :validator="(val: string) => inviteValidator.validateProperty('email', val, 1)"
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

      <AntSelect
        v-model:value="inviteAs"
        :options="options"
        :errors="inviteValidator.errorMap['roleId']"
        :is-error="
          inviteValidator.errorMap['roleId'] &&
          inviteValidator.errorMap['roleId'].length > 0
        "
        :validator="(val: string) => inviteValidator.validateProperty('roleId', val, 1)"
        label="Invite as"
        data-cy="role-select"
      />
    </AntForm>

    <template #buttons>
      <AntButton
        label="Cancel"
        @click="inviteUserActive = false"
      />

      <AntButton
        type="submit"
        data-cy="invite-user-submit"
        form="invite-user-form"
        primary
      >
        Invite
      </AntButton>
    </template>
  </AntModal>

  <AntButton
    :primary="true"
    class="whitespace-nowrap"
    data-cy="invite-user-button"
    @click="inviteUserActive = true"
  >
    Benutzer einladen
  </AntButton>
</template>
