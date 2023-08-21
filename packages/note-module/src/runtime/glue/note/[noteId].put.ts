import {
  useValidator,
  isTypeOfRule,
  Types,
  notBlankRule,
} from '@antify/validate';

export type Response = {
  default?: {
    content: string;
  };
  notFound?: string;
};
export type Input = {
  content: string;
};
export const validator = useValidator({
  content: [(val: unknown) => isTypeOfRule(val, Types.STRING), notBlankRule],
});
