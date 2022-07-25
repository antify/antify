export type Response = {
  default?: {
    id: string;
    title: string;
    url: string;
  };
  notFound?: {
    errors: string[];
  };
};
