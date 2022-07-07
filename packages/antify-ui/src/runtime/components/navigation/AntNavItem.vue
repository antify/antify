<script lang="ts">
export default {
  name: "AntNavItem",
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { ref } from "vue";
import type { NavItem } from "../../types/NavItem.type";

const props = defineProps({
  navItem: {
    type: NavItem,
    required: true,
  },
});

const showSubNavigation = ref<Boolean>(false);

const openSubItemMenu = () => {
  showSubNavigation.value = !showSubNavigation.value;
};
</script>

<template>
  <!-- TODO:: Find better solution, DRY -->
  <router-link
    v-if="navItem.route"
    :to="navItem.route"
    class="group grid px-2 py-2 text-base font-medium rounded-md"
    :class="{
      'text-gray-600 hover:bg-gray-50 hover:text-gray-900': !navItem.active,
      'bg-gray-100 text-gray-900': navItem.active,
      'grid-cols-2': navItem.subItems,
    }"
  >
    <div class="flex">
      <fa-icon
        v-if="navItem.icon"
        :icon="navItem.icon"
        class="text-gray-500 mr-3 flex-shrink-0 h-6 w-6"
      />
      <!-- Spacer if no icon is supplyed-->
      <div v-else class="mr-3 w-6" />

      <p>{{ navItem.label }}</p>
    </div>

    <div
      v-if="navItem.subItems"
      class="justify-self-end cursor-pointer"
      @click="openSubItemMenu()"
    >
      <fa-icon :icon="faAngleDown" />
    </div>

    <div v-if="showSubNavigation" class="col-span-2 -mx-2">
      <AntNavItem
        v-for="(subNavItem, index) in navItem.subItems"
        :key="`${index}-${navItem.label}-${subNavItem.label}`"
        :navItem="subNavItem"
      />
    </div>
  </router-link>

  <div
    v-else
    class="group grid px-2 py-2 text-base font-medium rounded-md"
    :class="{
      'text-gray-600 hover:bg-gray-50 hover:text-gray-900': !navItem.active,
      'bg-gray-100 text-gray-900': navItem.active,
      'grid-cols-2': navItem.subItems,
    }"
  >
    <div class="flex">
      <fa-icon
        v-if="navItem.icon"
        :icon="navItem.icon"
        class="text-gray-500 mr-3 flex-shrink-0 h-6 w-6"
      />
      <!-- Spacer if no icon is supplyed-->
      <div v-else class="mr-3 w-6" />

      <p>{{ navItem.label }}</p>
    </div>

    <div
      v-if="navItem.subItems"
      class="justify-self-end cursor-pointer"
      @click="openSubItemMenu()"
    >
      <fa-icon :icon="faAngleDown" />
    </div>

    <div
      class="col-span-2 -mx-2 transition-all duration-500 ease-in-out"
      :class="{
        'max-h-0 overflow-hidden m-0 -translate-y-96 opacity-0':
          !showSubNavigation,
        'max-h-60 mt-2 translate-y-96 opacity-100': showSubNavigation,
      }"
    >
      <AntNavItem
        class="px-0"
        v-for="(subNavItem, index) in navItem.subItems"
        :key="`${index}-${navItem.label}-${subNavItem.label}`"
        :navItem="subNavItem"
      />
    </div>
  </div>
</template>
