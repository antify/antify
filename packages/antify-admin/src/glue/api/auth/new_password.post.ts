import {
  notBlankRule,
  Types,
  isTypeOfRule,
  useValidator,
} from '@antify/ant-validate';

export type Response = {
  default?: {};
  badRequest?: {
    errors: string[];
  };
};

export type Input = {
  token: string;
  password: string;
};

export const validator = useValidator({
  password: [(val: unknown) => isTypeOfRule(val, Types.STRING), notBlankRule],
  repeatPassword: [
    (val: unknown) => isTypeOfRule(val, Types.STRING),
    notBlankRule,
  ],
});
