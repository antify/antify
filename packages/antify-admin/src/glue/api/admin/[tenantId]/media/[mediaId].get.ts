export type Response = {
    default?: {
        id: string
        title: string
    }
    notFound?: {
        errors: string[]
    }
}