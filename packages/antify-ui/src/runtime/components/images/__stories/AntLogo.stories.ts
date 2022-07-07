import AntLogo from '../AntLogo.vue';

export default {
  title: 'Components/Images/Ant Logo',
  component: AntLogo,
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
  },
};

const Template = (args: any) => ({
  components: { AntLogo },
  setup() {
    return { args };
  },
  template: `<AntLogo v-bind="args"/>`,
});

export const Primary = Template.bind({});
// @ts-ignore
Primary.args = {
  logoUrl:
    'https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg',
  alt: 'Logo',
};
