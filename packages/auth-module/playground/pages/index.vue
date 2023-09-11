<template>
  <ul>
    <li><NuxtLink :to="{ name: 'login' }">Login page</NuxtLink></li>
    <li>
      <NuxtLink
        :to="{
          name: 'register',
          query: { mail: 'admin@admin.de', code: '0815' },
        }"
        >Register page</NuxtLink
      >
    </li>
    <li>
      <NuxtLink
        :to="{
          name: 'forgot-password',
        }"
        >Forgot password page</NuxtLink
      >
    </li>
    <li>
      <NuxtLink
        :to="{
          name: 'reset-password',
          query: {
            code: '0815',
            mail: 'admin@admin.de',
          },
        }"
        >Reset password page</NuxtLink
      >
    </li>
  </ul>
</template>
