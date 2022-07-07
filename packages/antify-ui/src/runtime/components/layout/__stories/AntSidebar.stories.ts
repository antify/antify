import AntSidebar from '../AntSidebar.vue';

export default {
  title: 'Components/Layout/Ant Sidebar',
  component: AntSidebar,
};

const Template = (args: any) => ({
  components: { AntSidebar },
  setup() {
    return { args };
  },
  template: `
  <AntSidebar v-bind="args" >
  </AntSidebar>
  `,
});
/**
 * Primary use of Table.
 */
export const Primary = Template.bind({});
// @ts-ignore
Primary.args = {
  open: true,
};
