export type AuthRefreshTokenPostResponse = {
    default?: {
        token: string
    }
    invalidCredentials?: {
        errors: string[]
    }
}