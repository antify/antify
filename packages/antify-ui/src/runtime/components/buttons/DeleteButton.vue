<script lang="ts">
export default {
  name: 'DeleteButton',
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
import { reactive, computed } from 'vue';
import AntButton from './AntButton.vue';

const { id, label, size, backgroundColor, icon } = defineProps({
  id: {
    type: String,
  },
  label: {
    type: String,
  },
  size: {
    type: String,
    validator: function (value) {
      return ['small', 'medium', 'large'].indexOf(value) !== -1;
    },
  },
  backgroundColor: {
    type: String,
  },
  icon: {
    type: Object,
  },
});

defineEmits('click');

const onClick = () => {
  emit('click');
};
</script>

<template>
  <div>
    <AntButton
      :id="id"
      :label="label"
      class="text-red-500 border-red-500"
      @click="onClick"
      :backgroundColor="backgroundColor"
      :size="size"
    />
  </div>
</template>
