<script
  lang="ts"
  setup
>
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

defineProps<{ loading: boolean }>();
</script>

<template>
  <div
    class="absolute w-full h-full top-0 left-0 bg-black bg-opacity-50 transition-opacity duration-500 overflow-hidden"
    :class="{
      'opacity-0 max-h-0': !loading,
      'opacity-100 max-h-full': loading,
    }"
  >
    <div class="flex w-full h-full justify-center items-center text-5xl">
      <fa-icon
        :icon="faSpinner"
        class="fa-spin text-gray-800"
      />
    </div>
  </div>
</template>
