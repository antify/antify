import AntRadio from '../AntRadio.vue';

export default {
  title: 'Components/Forms/Radio/Ant Radio',
  component: AntRadio,
};

const Template = (args: any) => ({
  components: { AntRadio },
  setup() {
    return { args };
  },
  template: `
  <div class="m-2">
    <AntRadio v-bind="args"/>
  </div>`,
});

export const Simple = Template.bind({});
// @ts-ignore
Simple.args = {
  id: 'radio-1234uz0asdf',
  label: 'Test',
  name: 'radio-group',
};
