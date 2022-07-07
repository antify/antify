<script lang="ts">
export default {
  name: 'AntRadioWidget',
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
import AntRadio from './AntRadio.vue';

const props = defineProps({
  label: {
    type: String,
  },
  radioButtons: {
    type: Array,
  },
  radioGroupName: {
    type: String,
  },
});
</script>

<template>
  <div class="flex space-x-6">
    <AntRadio
      v-for="(radio, index) in radioButtons"
      :key="`radio-button-${radio.id}-${index}`"
      :id="radio.id"
      :label="radio.label"
      :name="radioGroupName"
    />
  </div>
</template>
