export type ContextConfiguration = ContextConfigurationItem[];

export type ContextConfigurationItem =
  | SingleTenancyContextConfiguration
  | MultiTenancyContextConfiguration;

export type Context = {
  id: string;
};

export type SingleTenancyContextConfiguration = {
  isSingleTenancy: true;
} & Context;

export type MultiTenancyContextConfiguration = {
  isSingleTenancy: false;
} & Context;
