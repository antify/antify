import { useValidator, isTypeOfRule, Types, notBlankRule, emailRule } from "@antify/ant-validate";

export type Input = {
    email: string
    name: string | null
}
export type Response = {
    default?: User
    badRequest?: {
        errors: string[]
    },
}
export type User = {
    id: string
    email: string
    name: string | null
}
export const validator = useValidator({
    name: [
        (val: unknown) => isTypeOfRule(val, Types.STRING),
        notBlankRule
    ],
    email: [
        (val: unknown) => isTypeOfRule(val, Types.STRING),
        notBlankRule,
        emailRule
    ]
});