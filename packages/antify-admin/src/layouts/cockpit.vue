<script setup lang="ts">
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
const route = useRoute();
const me = useMeState();

const loading = ref<boolean>(false);
const throttle = ref(200);
const duration = ref(2000);
const userName = ref(me.value.name);
const profileHref = ref({ name: 'cockpit-profile' });

const navItems = computed(() => [
  {
    label: 'Dashboard',
    route: { name: 'cockpit-dashboard' },
    icon: faHouse,
    active: route.name === 'cockpit-dashboard',
  },
  {
    label: 'Benutzer',
    route: { name: 'cockpit-users' },
    icon: faUser,
    active: route.name === 'cockpit-users',
  },
  {
    label: 'Mandanten',
    route: { name: 'cockpit-tenants' },
    active: route.name === 'cockpit-tenants',
  },
  {
    label: 'E-Mail Templates',
    route: { name: 'cockpit-mail-templates' },
    icon: faTrophy,
    active: route.name === 'cockpit-mail-templates',
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
          class="h-full"
          src="~~~/assets/img/logo.svg"
          alt="Logo"
        />
      </AntLogo>
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
