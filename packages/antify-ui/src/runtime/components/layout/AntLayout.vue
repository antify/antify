<script lang="ts">
export default {
  name: "AntLayout",
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
import type { RouteLocationRaw } from "vue-router";
import { ref } from "vue";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import AntNavigation from "../navigation/AntNavigation.vue";

const { navItems, profileHref, userName } = defineProps({
  navItems: {
    type: Array,
  },
  profileHref: {
    type: RouteLocationRaw,
  },
  userName: {
    type: String,
  },
});

const sidebarDisplayed = ref<Boolean>(false);
</script>

<template>
  <div>
    <!-- Off-canvas menu for mobile, show/hide based on off-canvas menu state. -->
    <div
      class="
        w-3/5
        fixed
        inset-0
        flex
        z-40
        transition-all
        duration-500
        ease-in-out
        transform
      "
      :class="{
        'overflow-hidden m-0 -translate-x-full': !sidebarDisplayed,
        'translate-x-0': sidebarDisplayed,
      }"
    >
      <div
        class="
          inset-0
          bg-gray-600 bg-opacity-75
          transition-opacity
          ease-linear
          duration-300
        "
      />

      <AntNavigation
        :nav-items="navItems"
        :profile-href="profileHref"
        :user-name="userName"
        :is-open="sidebarDisplayed"
        @close="() => (sidebarDisplayed = false)"
      >
        <template v-for="(_, slot) of $slots" v-slot:[slot]="scope">
          <slot :name="slot" v-bind="scope" />
        </template>
      </AntNavigation>
    </div>

    <!-- Static sidebar for desktop -->
    <div class="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <AntNavigation
        :nav-items="navItems"
        :profile-href="profileHref"
        :user-name="userName"
      >
        <template v-for="(_, slot) of $slots" v-slot:[slot]="scope">
          <slot :name="slot" v-bind="scope" />
        </template>
      </AntNavigation>
    </div>

    <!-- Content -->
    <div class="md:pl-64 flex-1">
      <div class="absolute top-0 z-10 md:hidden pl-1 py-1.5">
        <!-- Open nav on mobile-->
        <button
          type="button"
          class="
            -ml-0.5
            -mt-0.5
            h-12
            w-12
            inline-flex
            items-center
            justify-center
            rounded-md
            text-gray-500
            hover:text-gray-900
            focus:outline-none
            focus:ring-2 focus:ring-inset focus:ring-indigo-500
          "
          @click="() => (sidebarDisplayed = true)"
        >
          <span class="sr-only">Open sidebar</span>

          <fa-icon :icon="faBars" class="h-6 w-6" />
        </button>
      </div>

      <main class="">
        <slot default />
      </main>
    </div>
  </div>
</template>
