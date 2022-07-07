import { useValidator, isTypeOfRule, Types, notBlankRule } from "@antify/ant-validate";

export type Response = {
    default?: {
        id: string
        title: string
        content: string
    }
    badRequest?: {
        errors: string[]
    }
}
export type Input = {
    title: string
    content: string
}
export const validator = useValidator({
    title: [
        (val: unknown) => isTypeOfRule(val, Types.STRING),
        notBlankRule,
    ],
    content: [
        (val: unknown) => isTypeOfRule(val, Types.STRING),
        notBlankRule
    ]
});