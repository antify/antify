<script
  setup
  lang="ts"
>
import { Response as GetResponse } from '~~/glue/api/users/[userId].get';
import TenantLink from '~~/components/fields/TenantLink.vue';
import {
  validator as baseValidator,
  Response as PutResponse,
} from '~~/glue/api/users/[userId].put';
import UserTable from '~~/components/entity/user/UserTable.vue';
import { AntTabsType } from '@antify/antify-ui';

const route = useRoute();
const router = useRouter();
const { $toaster } = useNuxtApp();

const { data: user, refresh } = await useFetch<GetResponse | PutResponse>(
  `/api/users/${route.params.userId}`,
  useDefaultFetchOpts()
);
const { data: roles } = await useFetch(
  '/api/roles/roles',
  useDefaultFetchOpts()
);

const errors = ref([]);
const search = ref('');
const loading = ref<Boolean>(false);
const deleteDialogActive = ref<Boolean>(false);
const validator = ref(baseValidator);
const tabs = ref<AntTabsType[]>([
  {
    name: 'Stammdaten',
    current: true,
    to: '',
  },
]);

const roleOptions = computed(() => {
  return (
    roles.value as {
      permissions: string[];
      name: string;
      id: string;
      isAdmin: boolean;
    }[]
  ).map((role) => ({
    value: role.id,
    label: role.name,
  }));
});

async function onSubmit() {
  loading.value = true;
  errors.value = [];

  validator.value.validate(user.value.default, 1);

  if (validator.value.hasErrors()) {
    loading.value = false;

    return;
  }

  await useFetch<PutResponse>(`/api/users/${route.params.userId}`, {
    ...useDefaultFetchOpts(),
    ...{
      method: 'PUT',
      body: user.value.default,
    },
  });
  loading.value = false;

  $toaster.toastUpdated();
  refresh();
}

async function deleteUser() {
  await useFetch(`/api/users/${route.params.userId}`, {
    ...useDefaultFetchOpts(),
    ...{
      method: 'DELETE',
    },
  });

  $toaster.toastDeleted();
  deleteDialogActive.value = false;

  router.push({ name: 'admin-tenantId-users' });
}

async function banUser() {
  await useFetch<PutResponse>(`/api/users/${route.params.userId}/ban`, {
    ...useDefaultFetchOpts(),
    ...{
      method: 'PUT',
    },
  });

  $toaster.toastUpdated();
  refresh();
}

async function unbanUser() {
  await useFetch<PutResponse>(`/api/users/${route.params.userId}/unban`, {
    ...useDefaultFetchOpts(),
    ...{
      method: 'PUT',
    },
  });

  $toaster.toastUpdated();
  refresh();
}
</script>

<template>
  <div>
    <AntDualContent>
      <template #mainHead>
        <AntTabs :tabs="tabs"></AntTabs>

        <div class="flex space-x-4">
          <DeleteButton
            v-if="!user.default.isAdmin"
            label="Löschen"
            @click="deleteDialogActive = true"
          />

          <AntButton
            v-if="!user.default.isAdmin && !user.default.isBanned"
            label="Sperren"
            @click="banUser"
          />

          <AntButton
            v-if="!user.default.isAdmin && user.default.isBanned"
            label="Sperre aufheben"
            @click="unbanUser"
          />
        </div>
      </template>

      <template #mainBody>
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
          @submit.prevent="onSubmit"
          class="flex flex-col bg-white"
          id="user-create-form"
        >
          <div data-cy="name">
            <AntInput
              v-model:value="user.default.name"
              label="Name"
              :errors="validator.errorMap['name']"
              :validator="(val: string) => validator.validateProperty('name', val, 1)"
              disabled
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
              v-model:value="user.default.email"
              label="E-Mail"
              :errors="validator.errorMap['email']"
              :validator="(val: string) => validator.validateProperty('email', val, 1)"
              disabled
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

          <div data-cy="roles">
            <AntSelect
              label="Rolle"
              :options="roleOptions"
              v-model:value="user.default.roleId"
              @change="
                () =>
                  validator.validateProperty('roleId', user.default.roleId, 1)
              "
            />

            <div
              v-for="message in validator.errorMap['roleId']"
              class="text-red-600"
              data-cy="error"
            >
              {{ message }}
            </div>
          </div>
        </AntForm>
      </template>

      <template #mainFooter>
        <AntButton>
          <TenantLink
            :to="{
              name: 'admin-tenantId-users',
            }"
          >
            Zurück
          </TenantLink>
        </AntButton>

        <AntButton
          type="submit"
          data-cy="submit"
          :primary="true"
          form="user-create-form"
        >
          Speichern
        </AntButton>
      </template>

      <template #asideHead>
        <AntInput
          v-model:value="search"
          placeholder="Suche"
        />
      </template>

      <template #asideBody>
        <UserTable :single-col="true" />
      </template>
    </AntDualContent>

    <AntModal
      v-model:active="deleteDialogActive"
      title="Benutzer löschen"
    >
      <div>
        Sind sie sicher das Sie diesen Benutzer wirklich, sicherlich und
        unwiederruflich löschen wollen?
      </div>

      <template #buttons>
        <AntButton
          primary
          @click="deleteDialogActive = false"
        >
          Abbrechen
        </AntButton>

        <DeleteButton
          label="Löschen"
          @click="deleteUser"
        />
      </template>
    </AntModal>
  </div>
</template>
