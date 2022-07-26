<script setup>
import {
  faHouse,
  faTrophy,
  faUser,
  faUsers,
  faPhotoFilm,
} from '@fortawesome/free-solid-svg-icons';
const { $auth } = useNuxtApp();

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
</script>

<template>
  <!-- <AntLayout>
    <main class="flex-1 bg-gray-100 min-h-screen">
      <slot />

      <Toaster />
    </main>
  </AntLayout> -->
  <AntLayout
    :nav-items="navItems"
    :profile-href="profileHref"
    :user-name="userName"
    class="bg-gray-50"
  >
    <template #logo>
      <AntLogo>
        <img class="h-full" src="~~~/assets/img/logo.svg" alt="Logo" />
      </AntLogo>
    </template>

    <template #profilePicture>
      <AntProfilePicture v-if="me.url" :image-url="me.url" alt="" />
      <!-- TODO:: use some default image instead -->
    </template>

    <template #default>
      <slot />
    </template>
  </AntLayout>
</template>
