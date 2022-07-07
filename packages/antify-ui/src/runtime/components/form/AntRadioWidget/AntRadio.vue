<script lang="ts">
export default {
  name: 'AntRadio',
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
import { computed } from 'vue';
import { uuid } from 'vue3-uuid';

const props = defineProps({
  id: {
    type: String,
  },
  label: {
    type: String,
  },
  name: {
    type: String,
  },
});

const _id = computed<String>(() => {
  return props.id ? props.id : uuid.v4();
});
</script>

<template>
  <div class="flex items-center space-x-3">
    <input :id="_id" :name="name" type="radio" />

    <label :for="_id">{{ label }}</label>
  </div>
</template>
