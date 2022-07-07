import AntSelect from '../AntSelect.vue';

export default {
  title: 'Components/Forms/Ant Select',
  component: AntSelect,
};

const Template = (args: any) => ({
  components: { AntSelect },
  setup() {
    return { args };
  },
  template: '<AntSelect v-bind="args"/>',
});

/**
 * Primary use of input field.
 */
export const Primary = Template.bind({});
// @ts-ignore
Primary.args = {
  id: 'select-id-123456789',
  label: 'Select',
  placeholder: 'Select placeholder',
  options: [
    {
      label: 'Option 1',
      value: '1',
    },
    {
      label: 'Option 2',
      value: '2',
    },
    {
      label: 'Option 3',
      value: '3',
    },
    {
      label: 'Option 4',
      value: '4',
    },
  ],
};

/**
 * Primary use of input field.
 */
export const NoLabel = Template.bind({});
// @ts-ignore
NoLabel.args = {
  id: 'select-id-1234567891',
  label: 'Select',
  placeholder: 'Select placeholder',
  options: [
    {
      label: 'Option 1',
      value: '1',
    },
    {
      label: 'Option 2',
      value: '2',
    },
    {
      label: 'Option 3',
      value: '3',
    },
    {
      label: 'Option 4',
      value: '4',
    },
  ],
  showLabel: false,
};
