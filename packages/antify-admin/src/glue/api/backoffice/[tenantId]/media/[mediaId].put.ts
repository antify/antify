import {
  useValidator,
  isTypeOfRule,
  Types,
  notBlankRule,
} from '@antify/ant-validate';

export type Response = {
  default?: {
    id: string;
    title: string;
    url: string;
  };
  notFound?: {
    errors: string[];
  };
  badRequest?: {
    errors: string[];
  };
};
export type Input = {
  title: string;
};
export const validator = useValidator({
  title: [(val: unknown) => isTypeOfRule(val, Types.STRING), notBlankRule],
});
