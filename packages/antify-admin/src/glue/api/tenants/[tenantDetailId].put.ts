import {
  useValidator,
  isTypeOfRule,
  Types,
  notBlankRule,
} from '@antify/validate';

export type Response = {
  default?: {
    id: string;
    name: string;
  };
  badRequest?: {
    errors: string[];
  };
};
export type Input = {
  name: string;
};
export const validator = useValidator({
  name: [(val: unknown) => isTypeOfRule(val, Types.STRING), notBlankRule],
});
