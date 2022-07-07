<script lang="ts">
export default {
  name: 'AntTable',
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
import { ROW_TYPES } from '../../types/TableHeader.type';

const { navItems, profileHref, userName } = defineProps({
  headers: {
    type: Array,
  },
  data: {
    type: Array,
  },
});
</script>

<template>
  <div class="h-full">
    <div class="flex flex-col h-full">
      <div class="h-full">
        <div class="inline-block min-w-full align-middle h-full">
          <div
            class="
              overflow-hidden
              shadow
              ring-1 ring-black ring-opacity-5
              h-full
              overflow-x-auto overflow-y-auto
            "
          >
            <table
              class="min-w-full divide-y divide-gray-300 h-full max-h-full"
            >
              <thead class="bg-gray-50 sticky top-0 border-b">
                <tr class="">
                  <th
                    v-for="(header, index) in headers"
                    :key="`table-header-${header.identifier}-${index}`"
                    scope="col"
                    class="
                      py-3
                      pl-4
                      pr-3
                      text-left text-sm text-gray-900
                      uppercase
                      font-medium
                      sm:pl-6
                    "
                    :class="header.headerClassList"
                  >
                    {{ header.title }}
                  </th>

                  <slot name="lastHeader"></slot>
                </tr>
              </thead>

              <tbody class="divide-y divide-gray-200 bg-white">
                <tr
                  v-for="(elem, index) in data"
                  :key="`table-row-${elem.id}-${index}`"
                >
                  <td
                    v-for="(header, index) in headers"
                    :key="`table-cell-${header.identifier}-${index}`"
                    class="
                      whitespace-nowrap
                      py-2
                      pl-4
                      pr-3
                      text-sm
                      font-medium
                      text-gray-900
                      sm:pl-6
                    "
                  >
                    <div
                      v-if="header.type === ROW_TYPES.TEXT"
                      :class="header.rowClassList"
                    >
                      {{ elem[header.identifier] }}
                    </div>

                    <div
                      v-else-if="header.type === ROW_TYPES.IMAGE"
                      :class="header.rowClassList"
                    >
                      <img
                        :src="elem[header.identifier]"
                        :alt="elem[header.identifier]"
                      />
                    </div>

                    <div
                      v-else-if="header.type === ROW_TYPES.HTML"
                      :class="header.rowClassList"
                      v-html="elem[header.identifier]"
                    />

                    <div
                      v-else-if="header.type === ROW_TYPES.TEXT_WITH_LINKS"
                      :class="header.rowClassList"
                    >
                      <div>{{ elem[header.identifier] }}</div>

                      <div
                        v-for="(link, index) in header.links"
                        :key="`links-${header.identifier}-${index}`"
                        class="text-xs inline-block"
                      >
                        <span v-if="index !== 0">&nbsp;|&nbsp;</span>

                        <a
                          :href="link.href"
                          class="text-blue-600 hover:text-blue-800"
                        >
                          {{ link.label }}
                        </a>
                      </div>
                    </div>
                  </td>

                  <slot name="lastCell" />
                </tr>

                <tr v-if="data.length <= 0">
                  <slot name="emptyState" />
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
