<script lang="ts">
export default {
  name: 'AntDropzone',
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
const { dropzoneType } = defineProps({
  id: {
    type: String,
    required: true,
  },
  dropzoneType: {
    type: String,
    validator: function (value) {
      return ['copy', 'move', 'link'].indexOf(value) !== -1;
    },
    default: 'copy',
  },
});

const onDrop = (event) => {
  $emit('dropped', event.dataTransfer.getData(`${id}-data`));
};
</script>

<template>
  <div
    :dropzone="dropzoneType"
    class="
      w-full
      h-48
      border-dashed border-4
      text-2xl text-gray-300
      italic
      font-semibold
      flex
      justify-center
      items-center
      hover:text-gray-500
      hover:border-gray-500
      transition-all
      rounded-xl
      select-none
    "
    @drop="onDrop"
  >
    <slot name="dropzoneText">Dropzone</slot>
  </div>
</template>
