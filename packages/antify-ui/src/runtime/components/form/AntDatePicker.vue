<script lang="ts">
export default {
  name: 'AntDatePicker',
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { uuid } from 'vue3-uuid';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

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
  <div>
    <label :for="_id">{{ label }}</label>

    <Datepicker v-model="_value"></Datepicker>
  </div>
</template>
