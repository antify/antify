import { useValidator, isTypeOfRule, Types, notBlankRule, emailRule } from "@antify/ant-validate";

export type Input = {
    email: string
    name: string
    roleId: string
}
export type Response = {
    default?: {
        id: string
        email: string
        name: string
        roleId: string
    }
    badRequest?: {
        errors: string[]
    }
}
export type User = {
    id: string
    email: string
    name: string
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
    ],
    roleId: [
        (val: unknown) => isTypeOfRule(val, Types.STRING),
        notBlankRule
    ]
});