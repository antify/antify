import AntDraggable from '../AntDraggable.vue';
import AntInput from '../../form/AntInput.vue';

export default {
  title: 'Components/DragDrop/Draggable',
  component: AntDraggable,
};

const Template = (args: any) => ({
  components: { AntDraggable, AntInput },
  setup() {
    return {
      args,
    };
  },
  template: `
  <AntDraggable v-bind="args" >
    <AntInput id="input-1234" value="" label="Draggable Input" />
  </AntDraggable>`,
});

export const Simple = Template.bind({});
// @ts-ignore
Simple.args = {};

export const WithDragger = Template.bind({});
// @ts-ignore
WithDragger.args = {
  showGrabber: true,
};
