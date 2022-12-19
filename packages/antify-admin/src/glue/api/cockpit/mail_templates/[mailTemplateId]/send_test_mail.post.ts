import {
  useValidator,
  isTypeOfRule,
  Types,
  notBlankRule,
  emailRule,
} from '@antify/validate';

export type Input = {
  testMail: string;
};
export const validator = useValidator({
  testMail: [
    (val: unknown) => isTypeOfRule(val, Types.STRING),
    notBlankRule,
    emailRule,
  ],
});
