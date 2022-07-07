<script lang="ts">
export default {
  name: 'AntPagination',
  inheritAttrs: false,
};
</script>

<template>
  <nav
    class="
      bg-white
      px-4
      py-3
      flex
      items-center
      justify-between
      border-t border-gray-200
      sm:px-6
    "
    aria-label="Pagination"
  >
    <div class="hidden sm:block">
      <slot name="position" />
    </div>
    <div class="flex-1 flex justify-between sm:justify-end">
      <slot name="buttons" />
    </div>
  </nav>
</template>
