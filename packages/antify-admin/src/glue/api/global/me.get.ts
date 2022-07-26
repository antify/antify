export type Response = {
  default: User;
};
export type User = {
  id: string;
  email: string;
  name: string | null;
  url: string;
};
