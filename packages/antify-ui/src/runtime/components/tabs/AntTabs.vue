<script>
export default {
  name: 'AntTabs',

  props: {
    tabs: {
      type: Array
    }
  },

  emits: ['click'],

  setup(props, {emit}) {

    return {
      onClick() {
        emit('click');
      }
    };
  }
};
</script>

<template>
  <div>
    <div class="sm:hidden">
      <label
        for="tabs"
        class="sr-only"
      >
        Select a tab
      </label>

      <!-- Use an "onChange" listener to redirect the user to the selected tab URL. -->
      <select
        id="tabs"
        name="tabs"
        class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        <option
          v-for="tab in tabs"
          :key="tab.name"
          :selected="tab.current"
        >
          {{ tab.name }}
        </option>
      </select>
    </div>

    <div class="hidden sm:block">
      <div class="border-b border-gray-200">
        <nav
          class="-mb-px flex space-x-8"
          aria-label="Tabs"
        >
          <div
            v-for="tab in tabs"
            :key="tab.name"
            :class="[
              tab.current ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer'
            ]"
            :aria-current="tab.current ? 'page' : undefined"
            @click="onClick(tab)"
          >
            {{ tab.name }}
          </div>
        </nav>
      </div>
    </div>
  </div>
</template>
