export type Response = {
  default?: Default[];
};

export type Default = {
  id?: string;
  name?: string;
  isAdmin?: boolean;
  permissions?: string[];
};
