<script lang="ts">
export default {
  name: 'AntCheckbox',
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
import { computed } from 'vue';
import { uuid } from 'vue3-uuid';

const emit = defineEmits(['update:value']);

const props = defineProps({
  id: {
    type: String,
  },
  label: {
    type: String,
  },
  value: {
    type: String,
  },
});

const _id = computed(() => {
  return props.id ? props.id : uuid.v4();
});

const _value = computed({
  get: () => {
    return props.value;
  },
  set: (val) => {
    emit('update:value', val);
  },
});
</script>

<template>
  <div class="flex items-center space-x-3">
    <input type="checkbox" :id="_id" v-model="_value" />

    <label :for="_id">{{ label }}</label>
  </div>
</template>
