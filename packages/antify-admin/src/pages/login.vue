<script setup lang='ts'>
</script>

<template>
  <AntAuthLoginPage
    context="core"
    :forgot-password-route="{ name: 'forgot-password' }"
    @login="() => $router.push({ name: 'cockpit' })"
  />
</template>
