<script setup lang='ts'>
import { AntToaster, ANT_TOASTER_TYPE } from '@antify/antify-ui';
import { ToastType } from '../composables/states';
import {
  faHouse,
  faTrophy,
  faUsers,
  faHouseUser,
  faPhotoFilm
} from '@fortawesome/free-solid-svg-icons';
import { JsonWebToken } from '@antify/ant-guard';

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
    active: route.name === 'cockpit-dashboard'
  },
  {
    label: 'Users',
    route: { name: 'cockpit-users' },
    icon: faUsers,
    active: route.name === 'cockpit-users'
  },
  {
    label: 'Tenants',
    route: { name: 'cockpit-tenants' },
    icon: faHouseUser,
    active: route.name === 'cockpit-tenants'
  },
  {
    label: 'Mail Templates',
    route: { name: 'cockpit-mail-templates' },
    icon: faTrophy,
    active: route.name === 'cockpit-mail-templates'
  },
  {
    label: 'Media',
    route: { name: 'cockpit-media' },
    icon: faPhotoFilm,
    active: route.name === 'cockpit-media'
  },
  {
    label: 'Logout',
    active: false,
    clickHandler: () => $auth.logout()
  }
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
          : ANT_TOASTER_TYPE.NOTIFICATION
  }));

  return elem;
});

hook('page:start', () => {
  loading.value = true;
});
hook('page:finish', () => {
  loading.value = false;
});

const defaultToken: JsonWebToken = {
  id: 'an-user-id',
  isSuperAdmin: false,
  providers: [
    {
      providerId: 'core',
      isAdmin: false,
      permissions: []
    }, {
      providerId: 'tenant',
      tenantId: '63e398316c6c22a1f5479ab6',
      isAdmin: false,
      permissions: []
    }
  ]
};
</script>

<template>
  <AntLayout
    :nav-items='navItems'
    :profile-href='profileHref'
    :user-name='userName'
    class='bg-gray-50'
  >
    <template #logo>
      <AntLogo>
        <img
          class='h-full'
          src='~~~/assets/img/logo.svg'
          alt='Logo'
        />
      </AntLogo>
    </template>

    <template #profilePicture>
      <AntProfilePicture
        v-if='me.url'
        :image-url='me.url'
        alt=''
      />
      <!-- TODO:: use some default image instead -->
    </template>

    <template #default>
      <AntLoader
        :running='loading'
        :throttle='throttle'
        :duration='duration'
      />

      <slot />

      <AntToaster :toasts='toasts'>
        <template #default='{ toast }'>
          <div data-cy='toaster'>{{ toast.message }}</div>
        </template>
      </AntToaster>
    </template>
  </AntLayout>

  <AntDevModule :permissions='[]' :default-token='defaultToken' />
</template>
