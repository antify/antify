export enum ROW_TYPES {
  TEXT,
  IMAGE,
  HTML,
  TEXT_WITH_LINKS,
}

export type TableHeader = {
  identifier: string;
  headerClassList?: string;
  rowClassList?: string;
  title: string;
  type: ROW_TYPES;
  links?: {
    href: string;
    label: string;
  }[];
};
