import AntProgress from '../AntProgress.vue';

export default {
  title: 'Components/Forms/Ant Progress',
  component: AntProgress,
};

const Template = (args: any) => ({
  components: { AntProgress },
  setup() {
    return { args };
  },
  template: '<AntProgress v-bind="args"/>',
});

/**
 * Primary use of input field.
 */
export const Primary = Template.bind({});
// @ts-ignore
Primary.args = {
  id: 'progress-id-123456789',
  value: 3700,
  fullValue: 15000,
  label: 'EUR',
};
