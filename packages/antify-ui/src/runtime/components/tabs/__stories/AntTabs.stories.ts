import AntTabs from '../AntTabs.vue';

export default {
  title: 'Ant Tabs',
  component: AntTabs,
};

const Template = (args: any) => ({
  components: { AntTabs },
  setup() {
    return { args };
  },
  template: '<AntTabs v-bind="args"/>',
});

export const Primary = Template.bind({});
// @ts-ignore
Primary.args = {
  tabs: [
    { name: 'My Account', href: '#', current: false },
    { name: 'Company', href: '#', current: false },
    { name: 'Team Members', href: '#', current: true },
    { name: 'Billing', href: '#', current: false },
  ],
};

export const Empty = Template.bind({});
// @ts-ignore
Empty.args = {
  tabs: [],
};
