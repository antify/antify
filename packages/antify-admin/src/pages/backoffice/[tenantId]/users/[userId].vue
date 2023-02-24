<script setup lang="ts">
import TenantLink from '~~/components/fields/TenantLink.vue';
import RemoveUser from '~~/components/backoffice/user/RemoveUser.vue';
import BanOrUnbanUser from '~~/components/backoffice/user/BanOrUnbanUser.vue';
import { validator as baseValidator } from '~~/glue/api/users/[userId].put';
import UserTable from '~~/components/backoffice/user/UserTable.vue';
import { AntTabsType } from '@antify/antify-ui';
import { useContextHeader, useTenantHeader } from '@antify/context';

const route = useRoute();
const { $toaster } = useNuxtApp();

const search = ref('');
const saving = ref<Boolean>(false);
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
    data.value.roles.map((role) => ({
      value: role.id,
      label: role.name,
    })) || []
  );
});

const { data, refresh, error } = await useFetch(
  `/api/pages/backoffice/tenantId/users/${useRoute().params.userId}`,
  {
    headers: {
      // TODO:: remove with nuxt 3.2.0
      ...useRequestHeaders(),
      ...useContextHeader('tenant'),
      ...useTenantHeader(route.params.tenantId as string),
    },
  }
);

if (error.value) {
  throw createError(error.value.data);
}

if (data.value?.notFound) {
  await navigateTo(
    useBuildTenantLink(
      {
        name: 'backoffice-tenantId-users',
      },
      useRoute()
    )
  );
}

async function onSubmit() {
  saving.value = true;

  validator.value.validate(data.value.user, 1);

  if (validator.value.hasErrors()) {
    saving.value = false;

    return;
  }

  const { data: updateData, error } = await useFetch(
    `/api/pages/backoffice/tenantId/users/${route.params.userId}`,
    {
      method: 'PUT',
      body: data.value.user,
      headers: {
        ...useContextHeader('tenant'),
        ...useTenantHeader(route.params.tenantId as string),
      },
    }
  );

  if (error.value) {
    throw createError({ ...error.value.data, fatal: true });
  }

  if (data.value?.notFound) {
    $toaster.toastError(
      'Entry does not exists. Maybe an other user deleted it.'
    );

    await navigateTo(
      useBuildTenantLink(
        {
          name: 'backoffice-tenantId-roles',
        },
        useRoute()
      )
    );
  }

  if (data.value?.roleNotFound) {
    return $toaster.toastError(
      `The role does not exists anymore. Maybe an other user deleted it. Please select an other one.`
    );
  }

  data.value.user = updateData.value;

  saving.value = false;

  $toaster.toastUpdated();
}
</script>

<template>
  <div>
    <AntDualContent>
      <template #mainHead>
        <AntTabs :tabs="tabs"></AntTabs>

        <div class="flex space-x-4">
          <!-- TODO:: not self && userCan -->
          <RemoveUser :user-id="$route.params.userId" />

          <!-- TODO:: not self && userCan -->
          <BanOrUnbanUser
            :user-id="$route.params.userId"
            v-model:is-banned="data.user.isBannedInCurrentTenant"
          />
        </div>
      </template>

      <template #mainBody>
        <AntForm
          @submit.prevent="onSubmit"
          class="flex flex-col bg-white"
          id="user-create-form"
        >
          <div data-cy="name">
            <AntInput
              v-model:value="data.user.name"
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
              v-model:value="data.user.email"
              label="Mail"
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

          <div>
            <AntSelect
              label="Role"
              :options="roleOptions"
              v-model:value="data.user.roleId"
              data-cy="roles"
              @change="
                () => validator.validateProperty('roleId', data.user.roleId, 1)
              "
              :disabled="saving"
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
              name: 'backoffice-tenantId-users',
            }"
          >
            Back
          </TenantLink>
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
  </div>
</template>
