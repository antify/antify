import AntContent from '../AntContent.vue';
import AntTabs from '../../tabs/AntTabs.vue';
import AntTable from '../../table/AntTable.vue';
import AntButton from '../../buttons/AntButton.vue';
import { WithImage } from '../../table/__stories/AntTable.stories';

export default {
  title: 'Components/Layout/Ant Content',
  component: AntContent,
};

const Template = (args: any) => ({
  components: { AntContent },
  setup() {
    return { args };
  },
  template: `
  <AntContent>
    <template #head>
      <div v-if="args.head" v-html="args.head"/>
    </template>

    <template #body>
      <div v-if="args.body" v-html="args.body"/>
    </template>
  </AntContent>`,
});

export const Simple = Template.bind({});
// @ts-ignore
Simple.args = {
  head: '<h1 class="px-4 text-xl py-3">Dashboard</h1>',
  body: `<div class="m-4 border-4 border-dashed border-gray-200 rounded-lg h-screen"/>`,
};

export const Table = (args: any) => ({
  components: { AntContent, AntTabs, AntTable, AntButton },
  setup() {
    return {
      args,
      tabs: [
        { name: 'My Account', href: '#', current: false },
        { name: 'Company', href: '#', current: false },
        { name: 'Team Members', href: '#', current: true },
        { name: 'Billing', href: '#', current: false },
      ],
      ...WithImage,
    };
  },
  template: `
  <AntContent>
    <template #head>
      <AntTabs :tabs="tabs" />
    </template>

    <template #body>
      <AntTable class="h-screen" v-bind="args" />
    </template>

    <template #footer>
      <div class="bg-white w-full py-3 px-4 border-t flex justify-between">
        <AntButton label="Close" />
        <AntButton label="Save" primary="true" />
      </div>
    </template>
  </AntContent>`,
});
