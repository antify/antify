import {
  useValidator,
  isTypeOfRule,
  Types,
  notBlankRule,
} from '@antify/validate';

export type Input = {
  roleId: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
};

export const validator = useValidator({
  roleId: [(val: unknown) => isTypeOfRule(val, Types.STRING), notBlankRule],
});
