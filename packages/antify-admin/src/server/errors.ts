// TODO:: graph from h3 if the package exports it
export declare class H3Error extends Error {
    statusCode?: number;
    statusMessage?: string;
    data?: any;
}

export const createForbiddenError = (input: Partial<H3Error> = {}) => {
    return createError({
        ...{
            statusCode: 403,
            statusMessage: 'Forbidden'
        },
        ...input
    });
}

export const createUnauthorizedError = (input: Partial<H3Error> = {}) => {
    return createError({
        ...{
            statusCode: 401,
            statusMessage: 'Unauthorized',
            message: 'Invalid or missing token'
        },
        ...input
    });
}

export const createNotFoundError = (input: Partial<H3Error> = {}) => {
    return createError({
        ...{
            statusCode: 404,
            statusMessage: 'Not Found'
        },
        ...input
    });
}

export const createBadRequestError = (input: Partial<H3Error> = {}) => {
    return createError({
        ...{
            statusCode: 400,
            statusMessage: 'Bad Request'
        },
        ...input
    });
}

class HttpError extends Error {
    statusCode: number
    statusMessage: string

    constructor(message: string, statusMessage: string, statusCode: number) {
        super(message);
        // this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);

        this.statusCode = statusCode;
        this.statusMessage = statusMessage;
    }
}

export class HttpNotFoundError extends HttpError {
    constructor(message: string = '') {
        super(message, 'NotFound', 404);
    }
}

export class HttpForbiddenError extends HttpError {
    constructor(message: string = '') {
        super(message, 'Forbidden', 403);
    }
}

export class HttpUnauthorizedError extends HttpError {
    constructor(message: string = '') {
        super(message, 'Unauthorized', 401);
    }
}

export class HttpBadRequestError extends HttpError {
    constructor(message: string = '') {
        super(message, 'Bad Request', 400);
    }
}