<script setup>
import {
  faHouse,
  faTrophy,
  faUser,
  faUsers,
  faPhotoFilm
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
    icon: faPhotoFilm
  },
  {
    label: 'Logout',
    active: false,
    clickHandler: () => $auth.logout(),
  }, 
];
const userName = 'Some Name';
const profileHref = { name: 'admin-tenantId-profile' };
</script>

<template>
  <!-- <AntLayout>
    <main class="flex-1 bg-gray-100 min-h-screen">
      <slot />

      <Toaster />
    </main>
  </AntLayout> -->
  <AntLayout :nav-items="navItems" :profile-href="profileHref" :user-name="userName" class="bg-gray-50">
    <template #logo>
      <AntLogo>
        <img class="h-full" src="~~~/assets/img/logo.svg" alt="Logo" />
      </AntLogo>
    </template>

    <template #profilePicture>
      <AntProfilePicture
        image-url="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        alt="" />
    </template>

    <template #viewProfile> open profile </template>

    <template #default>
      <slot />
    </template>
  </AntLayout>
</template>
