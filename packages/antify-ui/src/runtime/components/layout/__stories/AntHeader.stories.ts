import AntHeader from '../AntHeader.vue';

export default {
  title: 'Components/Layout/Ant Header',
  component: AntHeader,
  argTypes: {
    headerType: {
      control: { type: 'select' },
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    },
  },
};

const Template = (args: any) => ({
  components: { AntHeader },
  setup() {
    return { args };
  },
  template: `<AntHeader v-bind="args" />`,
});

export const Simple = Template.bind({});
// @ts-ignore
Simple.args = {
  label: 'Header H1',
  headerType: 'h1',
};
