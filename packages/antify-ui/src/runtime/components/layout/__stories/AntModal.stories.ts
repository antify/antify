import AntModal from '../AntModal.vue';

export default {
  title: 'Components/Layout/Ant Modal',
  component: AntModal,
};

const Template = (args: any) => ({
  components: { AntModal },
  setup() {
    return { args };
  },
  template: `<AntModal v-bind="args" @close="() => args.active = false"/>`,
});

export const Primary = Template.bind({});
// @ts-ignore
Primary.args = {
  active: true,
};

export const Fullscreen = Template.bind({});
// @ts-ignore
Fullscreen.args = {
  active: true,
  fullscreen: true,
};
