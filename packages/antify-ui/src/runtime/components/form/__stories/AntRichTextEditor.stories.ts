import AntRichTextEditor from '../AntRichTextEditor.vue';

export default {
  title: 'Components/Forms/Ant Rich Text Editor',
  component: AntRichTextEditor,
};

const Template = (args: any) => ({
  components: { AntRichTextEditor },
  setup() {
    return { args };
  },
  template: '<AntRichTextEditor v-bind="args"/>',
});

export const Simple = Template.bind({});
// @ts-ignore
Simple.args = {
  data: '',
  label: 'This is a Rich Text Editor or WYSIWYG Editor',
};

export const WithDefaultContent = Template.bind({});
// @ts-ignore
WithDefaultContent.args = {
  data: '<h1><u>HI</u></h1> <p>This is an example on the <i>rich</i> text <b>editor</b>.</p>',
  label: 'This is a Rich Text Editor with content',
};
