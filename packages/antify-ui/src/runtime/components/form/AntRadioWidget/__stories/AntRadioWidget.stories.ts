import AntRadioWidget from '../AntRadioWidget.vue';

export default {
  title: 'Components/Forms/Radio/Ant Radio Widget',
  component: AntRadioWidget,
};

const Template = (args: any) => ({
  components: { AntRadioWidget },
  setup() {
    return { args };
  },
  template: `<div class="m-2"><AntRadioWidget v-bind="args"/></div>`,
});

export const Simple = Template.bind({});
// @ts-ignore
Simple.args = {
  label: 'Radio-group test',
  radioButtons: [
    {
      id: 'radio-1',
      label: 'Radio 1',
    },
    {
      id: 'radio-2',
      label: 'Radio 2',
    },
    {
      id: 'radio-3',
      label: 'Radio 3',
    },
  ],
  radioGroupName: 'radio-group',
};
