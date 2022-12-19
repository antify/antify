import {
  useValidator,
  isTypeOfRule,
  Types,
  notBlankRule,
  emailRule,
} from '@antify/validate';

export type Input = {
  email: string;
  roleId: string;
};

export const validator = useValidator({
  email: [
    (val: unknown) => isTypeOfRule(val, Types.STRING),
    notBlankRule,
    emailRule,
  ],
  roleId: [(val: unknown) => isTypeOfRule(val, Types.STRING), notBlankRule],
});
