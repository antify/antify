<script lang="ts" setup>
import { AntSelectOption } from '@antify/antify-ui';
import { ref } from 'vue';
import UserTable from '~~/components/entity/user/UserTable.vue';
import { validator as _inviteValidator } from '~~/glue/api/users/invite_user.post';
import { Response as RolesResponse } from '~~/glue/api/backoffice/[tenantId]/roles/roles.get';

const route = useRoute();
const router = useRouter();
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

const search = computed({
  get() {
    return route.query.search || '';
  },
  set(val) {
    router.push({
      name: route.name,
      query: {
        ...route.query,
        search: val,
      },
    });
  },
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
    ...useDefaultFetchOpts(),
    ...{
      method: 'POST',
      body: {
        email: inviteEmail.value,
        roleId: inviteAs.value,
      },
    },
  });

  $toaster.toastSuccess('Einladung wurde versendet');
  inviteUserActive.value = false;
}
</script>

<template>
  <AntContent>
    <template #head>
      <div class="flex justify-between items-center w-full space-x-8">
        <AntInput
          class="w-1/2"
          v-model:value="search"
          placeholder="Suche"
        />

        <AntButton
          :primary="true"
          class="whitespace-nowrap"
          data-cy="invite-user-button"
          @click="inviteUserActive = true"
        >
          Benutzer einladen
        </AntButton>
      </div>
    </template>

    <template #body>
      <UserTable :single-col="false" />

      <AntModal
        v-model:active="inviteUserActive"
        title="Neuen Benutzer einladen"
      >
        <AntForm
          id="invite-user-form"
          @submit.prevent="inviteUser"
        >
          <AntInput
            v-model:value="inviteEmail"
            label="E-Mail Adresse"
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
            label="Einladen als"
            data-cy="role-select"
          />
        </AntForm>

        <template #buttons>
          <AntButton
            label="Schließen"
            @click="inviteUserActive = false"
          />

          <AntButton
            type="submit"
            data-cy="invite-user-submit"
            form="invite-user-form"
            primary
          >
            Benutzer einladen
          </AntButton>
        </template>
      </AntModal>
    </template>
  </AntContent>
</template>
