<script
  setup
  lang="ts"
>
import { AntToaster, ANT_TOASTER_TYPE } from '@antify/antify-ui';
import { ToastType } from '../composables/states';
import {
  faHouse,
  faTrophy,
  faUser,
  faUsers,
  faPhotoFilm,
} from '@fortawesome/free-solid-svg-icons';
const { $auth, hook, $toaster } = useNuxtApp();

const navItems = [
  {
    label: 'Dashboard',
    route: { name: 'admin-tenantId-dashboard' },
    icon: faHouse,
    active: true,
  },
  {
    label: 'Benutzer',
    route: { name: 'admin-tenantId-users' },
    icon: faUser,
    active: false,
  },
  {
    label: 'Rollen',
    route: { name: 'admin-tenantId-roles' },
    icon: faUsers,
    active: false,
  },
  {
    label: 'E-Mail Templates',
    route: { name: 'admin-tenantId-mail-templates' },
    icon: faTrophy,
    active: false,
  },
  {
    label: 'Mandanten',
    route: { name: 'admin-tenantId-tenants' },
    active: false,
  },
  {
    label: 'Mediatheke',
    route: { name: 'admin-tenantId-media' },
    icon: faPhotoFilm,
  },
  {
    label: 'Logout',
    active: false,
    clickHandler: () => $auth.logout(),
  },
];

const me = useMeState();
const userName = me.value.name;
const profileHref = { name: 'admin-tenantId-profile' };

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

const loading = ref<boolean>(false);
const throttle = ref(200);
const duration = ref(2000);

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

      <AntToaster :toasts="toasts"></AntToaster>
    </template>
  </AntLayout>
</template>
