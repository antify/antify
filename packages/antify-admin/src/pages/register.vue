<script setup lang='ts'>
</script>

<template>
  <AntAuthRegisterPage
    context="core"
    :login-route="{ name: 'login' }"
    @register="() => $router.push({ name: 'cockpit' })"
  />
</template>
