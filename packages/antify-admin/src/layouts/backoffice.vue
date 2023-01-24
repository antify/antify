<script setup lang="ts">
import { AntToaster, ANT_TOASTER_TYPE } from '@antify/antify-ui';
import { ToastType } from '../composables/states';
import {
  faHouse,
  faTrophy,
  faUser,
  faUsers,
  faPhotoFilm,
  faCog,
} from '@fortawesome/free-solid-svg-icons';

const { $auth, hook, $toaster } = useNuxtApp();
const route = useRoute();
const me = useMeState();
const tenant = useCurrentTenantState();

const loading = ref<boolean>(false);
const throttle = ref(200);
const duration = ref(2000);
const userName = ref(me.value.name);
const profileHref = ref({ name: 'backoffice-tenantId-profile' });

const navItems = computed(() => [
  {
    label: 'Dashboard',
    route: { name: 'backoffice-tenantId-dashboard' },
    icon: faHouse,
    active: route.name === 'backoffice-tenantId-dashboard',
  },
  {
    label: 'User',
    route: { name: 'backoffice-tenantId-users' },
    icon: faUser,
    active: route.name === 'backoffice-tenantId-users',
  },
  {
    label: 'Roles',
    route: { name: 'backoffice-tenantId-roles' },
    icon: faUsers,
    active: route.name === 'backoffice-tenantId-roles',
  },
  {
    label: 'Mail Templates',
    route: { name: 'backoffice-tenantId-mail-templates' },
    icon: faTrophy,
    active: route.name === 'backoffice-tenantId-mail-templates',
  },
  {
    label: 'Setting',
    route: { name: 'backoffice-tenantId-tenant' },
    icon: faCog,
    active: route.name === 'backoffice-tenantId-tenant',
  },
  {
    label: 'Media',
    route: { name: 'backoffice-tenantId-media' },
    icon: faPhotoFilm,
    active: route.name === 'backoffice-tenantId-media',
  },
  {
    label: 'Logout',
    active: false,
    clickHandler: () => $auth.logout(),
  },
]);

const toasts = computed(() => {
  const elem = $toaster.getToasts().map((toast) => ({
    id: toast.id,
    message: toast.text,
    type:
      toast.type === ToastType.error
        ? ANT_TOASTER_TYPE.ERROR
        : toast.type === ToastType.warning
        ? ANT_TOASTER_TYPE.WARNING
        : ANT_TOASTER_TYPE.NOTIFICATION,
  }));

  return elem;
});

hook('page:start', () => {
  loading.value = true;
});
hook('page:finish', () => {
  loading.value = false;
});
</script>

<template>
  <AntLayout
    :nav-items="navItems"
    :profile-href="profileHref"
    :user-name="userName"
    class="bg-gray-50"
  >
    <template #logo>
      <AntLogo>
        <img
          v-if="tenant.url"
          class="h-full"
          :src="tenant.url"
          alt="Logo"
        />
        <img
          v-else
          class="h-full"
          src="~~~/assets/img/logo.svg"
          alt="Logo"
        />
      </AntLogo>
    </template>

    <template #header>
      <div class="m-2">
        <FieldsCurrentTenantSelectField />
      </div>
    </template>

    <template #profilePicture>
      <AntProfilePicture
        v-if="me.url"
        :image-url="me.url"
        alt=""
      />
      <!-- TODO:: use some default image instead -->
    </template>

    <template #default>
      <AntLoader
        :running="loading"
        :throttle="throttle"
        :duration="duration"
      />

      <slot />

      <AntToaster :toasts="toasts">
        <template #default="{ toast }">
          <div data-cy="toaster">{{ toast.message }}</div>
        </template>
      </AntToaster>
    </template>
  </AntLayout>
</template>
