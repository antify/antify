<script lang="ts">
export default {
  name: 'AntModal',
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
import { faCheck, faX } from '@fortawesome/free-solid-svg-icons';
import AntButton from '../buttons/AntButton.vue';

const { active, fullscreen } = defineProps({
  active: {
    type: Boolean,
    required: true,
  },
  fullscreen: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div
    class="
      items-end
      justify-center
      text-center
      sm:block
      sm:p-0
      absolute
      top-0
      left-0
      w-full
      z-50
      transform
      bg-gray-50
    "
    :class="{
      '-translate-y-full max-h-0 min-h-0 overflow-hidden': !active,
      'translate-y-0 h-full': active,
    }"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="
        fixed
        inset-0
        bg-gray-500 bg-opacity-50
        transition-all
        duration-500
      "
      :class="{ 'opacity-0': !active, 'opacity-20': active }"
      aria-hidden="true"
      @click="$emit('close')"
    />

    <!-- This element is to trick the browser into centering the modal contents. -->
    <span
      class="hidden sm:inline-block sm:h-screen sm:align-middle"
      aria-hidden="true"
    >
      &#8203;
    </span>

    <!-- Modal panel, show/hide based on modal state. -->
    <div
      class="
        absolute
        bg-gray-50
        overflow-auto
        shadow-xl
        transform
        transition-all
        duration-500
        sm:align-middle
      "
      :class="{
        'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95': !active,
        'opacity-100 translate-y-0 sm:scale-100': active,
        'w-full h-full top-0 left-0 sm:min-w-full': fullscreen,
        'top-12': !fullscreen,
      }"
    >
      <div>
        <div class="text-left">
          <div class="relative border-b w-full py-4 pl-3">
            <fa-icon
              :icon="faX"
              class="
                absolute
                right-0
                opacity-50
                hover:opacity-100
                transition-all
                duration-500
                w-5
                h-full
                pr-3
                top-0
                font-thin
              "
              @click="$emit('close')"
            />

            <h3
              class="text-xl leading-6 font-medium text-gray-900"
              id="modal-title"
            >
              <slot name="title"> Lorem ipsum </slot>
            </h3>
          </div>

          <div class="mt-2 px-3">
            <slot name="content">
              <p class="text-sm text-gray-500">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Consequatur amet labore.
              </p>
            </slot>
          </div>
        </div>
      </div>

      <div class="mt-5 sm:mt-6 text-right px-3 py-4 border-t">
        <slot name="buttons">
          <AntButton label="Close" :primary="true" />
        </slot>
      </div>
    </div>
  </div>
</template>
