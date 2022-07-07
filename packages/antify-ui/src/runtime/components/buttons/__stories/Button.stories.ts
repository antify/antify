import AntButton from '../AntButton.vue';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';

// More on default export: https://storybook.js.org/docs/vue/writing-stories/introduction#default-export
export default {
  title: 'Components/Buttons/Ant Button',
  component: AntButton,
  // More on argTypes: https://storybook.js.org/docs/vue/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
    onClick: {},
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
  },
};

// More on component templates: https://storybook.js.org/docs/vue/writing-stories/introduction#using-args
const Template = (args: any) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { AntButton },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup() {
    return { args };
  },
  // And then the `args` are bound to your component with `v-bind="args"`
  template: '<AntButton v-bind="args" />',
});

export const Primary = Template.bind({});
// @ts-ignore More on args: https://storybook.js.org/docs/vue/writing-stories/args
Primary.args = {
  primary: true,
  label: 'Button',
};

export const Secondary = Template.bind({});
// @ts-ignore
Secondary.args = {
  label: 'Button',
};

export const Large = Template.bind({});
// @ts-ignore
Large.args = {
  size: 'large',
  label: 'Button',
};

export const Small = Template.bind({});
// @ts-ignore
Small.args = {
  size: 'small',
  label: 'Button',
};

export const WithIcon = Template.bind({});
// @ts-ignore
WithIcon.args = {
  label: 'Button',
  icon: faCaretRight,
};
