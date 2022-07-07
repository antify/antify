<script lang="ts">
export default {
  name: 'CloseButton',
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
import { faX } from '@fortawesome/free-solid-svg-icons';

const { label, onlyIcon, icon, size } = defineProps({
  label: {
    type: String,
  },
  onlyIcon: {
    type: Boolean,
    default: true,
  },
  icon: {
    type: Object,
    default() {
      return faX;
    },
  },
  size: {
    type: String,
    default: 'medium',
  },
});
</script>

<template>

</template>
