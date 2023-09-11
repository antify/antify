<script lang='ts' setup>
import { Permission, useGuard, JsonWebToken } from '@antify/ant-guard';
import AntDevProviderBox from './AntDevProviderBox.vue';
import { useNuxtApp } from 'nuxt/app';
import { format, getUnixTime } from 'date-fns';

const permissions = inject<Permission[]>('permissions');
const defaultToken = inject<Permission[]>('defaultToken');
const props = defineProps<{
  open: boolean
}>();
const emit = defineEmits(['update:open']);
let guard = await useGuard(useNuxtApp().ssrContext?.event);
const _token = ref<JsonWebToken>(guard.getToken() || createToken());
const { data, status, error, execute } = useFetch(
  '/api/dev-module/create-jwt',
  {
    method: 'POST',
    body: _token,
    immediate: false,
    watch: false,
    onResponse() {
      guard.reset();

      _token.value = guard.getToken();
    }
  }
);
const _open = computed({
  get() {
    return props.open;
  },
  set(val) {
    emit('update:open', val);
  }
});

watch(_open, (val) => {
  if (val) {
    guard.reset();
    _token.value = guard.getToken() || createToken();
  }
});

async function login() {
  await execute();
}

async function logout() {
  guard.logoutUser();
  _token.value = createToken();
}

function reset() {
  _token.value = defaultToken || createToken({
    providers: [
      createEmptyProvider({ 'providerId': 'core' }),
      createEmptyProvider({ 'providerId': 'tenant' })
    ]
  });
}

function createToken(data: JsonWebToken = {}): JsonWebToken {
  return {
    ...{
      id: '',
      isSuperAdmin: false,
      providers: [
        createEmptyProvider()
      ]
    },
    ...data
  };
}

function createEmptyProvider(data = {}) {
  return {
    ...{
      isAdmin: false,
      providerId: '',
      tenantId: '',
      permissions: []
    }, ...data
  };
}

function addProvider(data = {}) {
  _token.value.providers.push(createEmptyProvider(data));
}

function removeProvider(index) {
  _token.value.providers.splice(index, 1);
}

const iat = computed({
  get() {
    if (!_token.value.iat) {
      return null;
    }

    return format(new Date(_token.value.iat * 1000), 'yyyy-MM-dd\'T\'HH:mm:ss');
  },
  set(val) {
    _token.value.iat = getUnixTime(new Date(val));
  }
});

const exp = computed({
  get() {
    if (!_token.value.exp) {
      return null;
    }

    return format(new Date(_token.value.exp * 1000), 'yyyy-MM-dd\'T\'HH:mm:ss');
  },
  set(val) {
    _token.value.exp = getUnixTime(new Date(val));
  }
});
</script>

<template>
  <AntModal v-model:active='_open' title='Generate JWT' fullscreen>
    <div class='flex justify-between space-x-4'>
      <div class='flex flex-col space-y-2 flex-grow'>
        <AntInput label='ID' v-model:value='_token.id' />

        <AntCheckbox label='Superadmin' v-model:checked='_token.isSuperAdmin' />

        <div>Providers</div>

        <div class='flex flex-wrap'>
          <AntDevProviderBox
            v-for='(provider, index) of _token.providers'
            v-model:is-admin='provider.isAdmin'
            v-model:provider-id='provider.providerId'
            v-model:tenant-id='provider.tenantId'
            v-model:permissions='provider.permissions'
            class='mb-4 mr-4'
            @remove='() => removeProvider(index)'
          />

          <div class='flex items-center mb-4'>
            <AntButton primary @click='addProvider'>+</AntButton>
          </div>
        </div>
      </div>

      <div class='w-2/5 flex-shrink-0 space-y-2'>
        <AntInput label='Issued at' type='datetime-local' v-model:value='iat' />
        <AntInput label='Expired at' type='datetime-local' v-model:value='exp' />

        <div class='bg-gray-200 rounded'>
          <pre class='p-2'>{{ _token }}</pre>
        </div>
      </div>
    </div>

    <template #buttons>
      <AntButton @click='logout'>Logout</AntButton>
      <AntButton @click='reset'>Set default data</AntButton>
      <AntButton primary @click='login' :disabled='status === "pending"'>Login</AntButton>
    </template>
  </AntModal>
</template>
