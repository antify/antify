<script lang="ts">
export default {
  name: "AntNavProfile",
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
import type { RouteLocationRaw } from "vue-router";

const { to, userName } = defineProps({
  to: {
    type: RouteLocationRaw,
    default: "#",
  },
  userName: {
    type: String,
  },
});
</script>

<template>
  <div class="flex-shrink-0 flex border-t border-gray-200 p-4">
    <router-link :to="to" class="flex-shrink-0 group block cursor-pointer">
      <div class="flex items-center">
        <div>
          <slot name="profilePicture" />
        </div>

        <div class="ml-3">
          <p
            class="
              text-base
              font-medium
              text-gray-700
              group-hover:text-gray-900
            "
          >
            {{ userName }}
          </p>

          <p
            class="text-sm font-medium text-gray-500 group-hover:text-gray-700"
          >
            <slot name="viewProfile" />
          </p>
        </div>
      </div>
    </router-link>
  </div>
</template>
