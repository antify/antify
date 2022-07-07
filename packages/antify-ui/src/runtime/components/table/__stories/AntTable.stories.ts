import AntTable from '../AntTable.vue';
import { ROW_TYPES } from '../../../types/TableHeader.type';

export default {
  title: 'Components/Table/Ant Table',
  component: AntTable,
};

const Template = (args: any) => ({
  components: { AntTable },
  setup() {
    return { args };
  },
  template: `
  <div class="h-96">
    <AntTable v-bind="args" >
      <template #emptyState>
        <td colspan="100" class="w-full py-2 text-center text-gray-500 text-2xl italic">Nothing to see here jet!</td>
      </template>
    </AntTable>
  </div>
  `,
});

const testData = [
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    picture:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Courtney Henry',
    title: 'Designer',
    email: 'courtney.henry@example.com',
    picture:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Tom Cook',
    title: 'Director, Product Development',
    email: 'tom.cook@example.com',
    picture:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Whitney Francis',
    title: 'Copywriter',
    email: 'whitney.francis@example.com',
    picture:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Leonard Krasner',
    title: 'Senior Designer',
    email: 'leonard.krasner@example.com',
    picture:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Floyd Miles',
    title: 'Principal Designer',
    email: 'floy.dmiles@example.com',
    picture:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Johannes Beyer',
    title: 'CEO',
    email: 'johannes@blue-panda.de',
    picture:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },

  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    picture:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Courtney Henry',
    title: 'Designer',
    email: 'courtney.henry@example.com',
    picture:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Tom Cook',
    title: 'Director, Product Development',
    email: 'tom.cook@example.com',
    picture:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Whitney Francis',
    title: 'Copywriter',
    email: 'whitney.francis@example.com',
    picture:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Leonard Krasner',
    title: 'Senior Designer',
    email: 'leonard.krasner@example.com',
    picture:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Floyd Miles',
    title: 'Principal Designer',
    email: 'floy.dmiles@example.com',
    picture:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Johannes Beyer',
    title: 'CEO',
    email: 'johannes@blue-panda.de',
    picture:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },

  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    picture:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Courtney Henry',
    title: 'Designer',
    email: 'courtney.henry@example.com',
    picture:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Tom Cook',
    title: 'Director, Product Development',
    email: 'tom.cook@example.com',
    picture:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Whitney Francis',
    title: 'Copywriter',
    email: 'whitney.francis@example.com',
    picture:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Leonard Krasner',
    title: 'Senior Designer',
    email: 'leonard.krasner@example.com',
    picture:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Floyd Miles',
    title: 'Principal Designer',
    email: 'floy.dmiles@example.com',
    picture:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Johannes Beyer',
    title: 'CEO',
    email: 'johannes@blue-panda.de',
    picture:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },

  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    picture:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Courtney Henry',
    title: 'Designer',
    email: 'courtney.henry@example.com',
    picture:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Tom Cook',
    title: 'Director, Product Development',
    email: 'tom.cook@example.com',
    picture:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Whitney Francis',
    title: 'Copywriter',
    email: 'whitney.francis@example.com',
    picture:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Leonard Krasner',
    title: 'Senior Designer',
    email: 'leonard.krasner@example.com',
    picture:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Floyd Miles',
    title: 'Principal Designer',
    email: 'floy.dmiles@example.com',
    picture:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Johannes Beyer',
    title: 'CEO',
    email: 'johannes@blue-panda.de',
    picture:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
];

/**
 * Primary use of Table.
 */
export const Primary = Template.bind({});
// @ts-ignore
Primary.args = {
  headers: [
    {
      title: 'Name',
      identifier: 'name',
      headerClassList: 'font-bold',
      rowClassList: '',
      type: ROW_TYPES.TEXT,
    },
    {
      title: 'Title',
      identifier: 'title',
      headerClassList: '',
      rowClassList: '',
      type: ROW_TYPES.TEXT,
    },
    {
      title: 'E-Mail',
      identifier: 'email',
      rowClassList: '',
      type: ROW_TYPES.TEXT,
    },
  ],
  data: testData,
};

/**
 * Posibility to add images and style them
 */
export const WithImage = Template.bind({});
// @ts-ignore
WithImage.args = {
  headers: [
    {
      title: 'Profilbild',
      identifier: 'picture',
      headerClassList: 'sr-only',
      rowClassList: 'w-12 rounded-full block overflow-hidden',
      type: ROW_TYPES.IMAGE,
    },
    {
      title: 'Name',
      identifier: 'name',
      headerClassList: 'font-bold',
      rowClassList: '',
      type: ROW_TYPES.TEXT,
    },
    {
      title: 'Title',
      identifier: 'title',
      headerClassList: '',
      rowClassList: '',
      type: ROW_TYPES.TEXT,
    },
    {
      title: 'E-Mail',
      identifier: 'email',
      rowClassList: '',
      type: ROW_TYPES.TEXT,
    },
  ],
  data: testData,
};

export const Links = Template.bind({});
// @ts-ignore
Links.args = {
  headers: [
    {
      title: 'Name',
      identifier: 'name',
      headerClassList: 'font-bold',
      rowClassList: '',
      type: ROW_TYPES.TEXT_WITH_LINKS,
      links: [
        {
          href: '#',
          label: 'Meetings',
        },
        {
          href: '#',
          label: 'Stammdaten',
        },
      ],
    },
    {
      title: 'Title',
      identifier: 'title',
      headerClassList: '',
      rowClassList: '',
      type: ROW_TYPES.TEXT,
    },
    {
      title: 'E-Mail',
      identifier: 'email',
      rowClassList: '',
      type: ROW_TYPES.TEXT,
    },
  ],
  data: testData,
};

export const SingleHeader = Template.bind({});
// @ts-ignore
SingleHeader.args = {
  headers: [
    {
      title: 'Name',
      identifier: 'name',
      headerClassList: 'font-bold',
      rowClassList: '',
      type: ROW_TYPES.TEXT_WITH_LINKS,
      links: [
        {
          href: '#',
          label: 'Meetings',
        },
        {
          href: '#',
          label: 'Stammdaten',
        },
      ],
    },
  ],
  data: testData,
};

export const EmptyState = Template.bind({});
// @ts-ignore
EmptyState.args = {
  headers: [
    {
      title: 'Name',
      identifier: 'name',
      headerClassList: 'font-bold',
      rowClassList: '',
      type: ROW_TYPES.TEXT,
    },
    {
      title: 'Title',
      identifier: 'title',
      headerClassList: '',
      rowClassList: '',
      type: ROW_TYPES.TEXT,
    },
    {
      title: 'E-Mail',
      identifier: 'email',
      rowClassList: '',
      type: ROW_TYPES.TEXT,
    },
  ],
  data: [],
};
