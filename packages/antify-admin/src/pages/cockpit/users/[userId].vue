<script setup lang="ts">
import UserTable from '~~/components/pages/cockpit/users/UserTable.vue';
import { AntTabsType } from '@antify/antify-ui';

const route = useRoute();
const router = useRouter();
const { $toaster } = useNuxtApp();

const search = ref('');
const loading = ref<Boolean>(true);
const saving = ref<Boolean>(false);
const deleteDialogActive = ref<Boolean>(false);

const tabs = ref<AntTabsType[]>([
  {
    name: 'Main data',
    current: true,
    to: '',
  },
  {
    name: 'Tenants',
    current: false,
    to: {
      name: 'cockpit-users-userId-tenant-accesses',
      params: { userId: useRoute().params.userId },
    },
  },
]);

let refresh: Function;
const userData = useUserDetailState();
const { data, refresh: userRefresh } = await useFetch(
  `/api/pages/cockpit/users/${useRoute().params.userId}`,
  useDefaultFetchOpts()
);

refresh = userRefresh;
userData.value = data;

loading.value = false;

async function deleteUser() {
  await useFetch(`/api/pages/cockpit/users/${route.params.userId}`, {
    ...useDefaultFetchOpts(),
    ...{
      method: 'DELETE',
    },
  });

  $toaster.toastDeleted();
  deleteDialogActive.value = false;

  router.push({ name: 'cockpit-users' });
}

async function banUser() {
  saving.value = true;
  await useFetch(`/api/users/${route.params.userId}/ban`, {
    ...useDefaultFetchOpts(),
    ...{
      method: 'PUT',
    },
  });

  saving.value = false;

  $toaster.toastUpdated();
  refresh();
}

async function unbanUser() {
  saving.value = true;

  await useFetch(`/api/users/${route.params.userId}/unban`, {
    ...useDefaultFetchOpts(),
    ...{
      method: 'PUT',
    },
  });

  saving.value = false;

  $toaster.toastUpdated();
  refresh();
}
onUnmounted(() => {
  userData.value = null;
});
</script>

<template>
  <div>
    <AntDualContent>
      <template #mainHead>
        <AntTabs :tabs="tabs"></AntTabs>

        <div class="flex space-x-4">
          <DeleteButton
            label="Delete"
            @click="deleteDialogActive = true"
          />

          <AntButton
            v-if="!userData.default.isBanned"
            label="Ban user"
            @click="banUser"
          />

          <AntButton
            v-if="userData.default.isBanned"
            label="Unban user"
            @click="unbanUser"
          />
        </div>
      </template>

      <template #mainBody>
        <NuxtPage></NuxtPage>
      </template>

      <template #mainFooter>
        <AntButton>
          <NuxtLink
            :to="{
              name: 'cockpit-users',
            }"
          >
            Back
          </NuxtLink>
        </AntButton>

        <AntButton
          type="submit"
          data-cy="submit"
          :primary="true"
          form="user-create-form"
        >
          Save
        </AntButton>
      </template>

      <template #asideHead>
        <AntInput
          v-model:value="search"
          placeholder="Search"
        />
      </template>

      <template #asideBody>
        <UserTable :single-col="true" />
      </template>
    </AntDualContent>

    <AntModal
      v-model:active="deleteDialogActive"
      title="Delete user"
    >
      <div>
        Sind sie sicher das Sie diesen Benutzer wirklich unwiederruflich löschen
        wollen?
      </div>

      <template #buttons>
        <AntButton
          primary
          @click="deleteDialogActive = false"
        >
          Cancel
        </AntButton>

        <DeleteButton
          label="Delete"
          @click="deleteUser"
        />
      </template>
    </AntModal>
  </div>
</template>
