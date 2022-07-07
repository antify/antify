<script lang="ts">
export default {
  name: 'AntDraggable',
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

const { id, data, showGrabber, dragType } = defineProps({
  id: {
    type: String,
    required: true,
  },
  data: {
    type: String,
    required: true,
  },
  showGrabber: {
    type: Boolean,
  },
  dragType: {
    type: String,
    validator: function (value) {
      return ['copy', 'move', 'link'].indexOf(value) !== -1;
    },
    default: 'copy',
  },
});

const dragstartEvent = (event) => {
  event.dataTransfer.dropEffect = dragType;
  event.dataTransfer.effectAllowed = dragType;
  event.dataTransfer.setData(`${id}-data`, data);
};
</script>

<template>
  <div
    draggable="true"
    class="cursor-pointer select-none flex items-center"
    @dragstart="dragstartEvent($event)"
  >
    <div
      v-if="showGrabber"
      class="
        grabber
        inline-block
        px-2
        py-1
        text-gray-400
        hover:text-gray-600
        transition-all
        duration-500
        h-full
      "
    >
      <fa-icon :icon="faEllipsisVertical" />
    </div>

    <slot></slot>
  </div>
</template>
