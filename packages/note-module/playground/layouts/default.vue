<script setup lang='ts'>
import { permissions } from '../../src/runtime/server/permissions';
const defaultToken: JsonWebToken = {
  id: 'an-user-id',
  isSuperAdmin: false,
  providers: [
    {
      providerId: 'core',
      isAdmin: false,
      permissions: permissions.map(permission => permission.id)
    }, {
      providerId: 'tenant',
      tenantId: 'note-module',
      isAdmin: false,
      permissions: permissions.map(permission => permission.id)
    }
  ]
};
</script>

<template>
  <slot />

  <AntToasterModule />
  <AntDevModule :permissions='permissions' :default-token='defaultToken' />
</template>
