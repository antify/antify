import {
  useValidator,
  isTypeOfRule,
  Types,
  notBlankRule,
  emailRule,
} from '@antify/ant-validate';

export type Response = {
  default?: {
    success: true;
  };
  notFound?: {
    errors: string[];
  };
};
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
