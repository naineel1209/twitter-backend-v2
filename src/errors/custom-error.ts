export class CustomError extends Error{
    constructor(public message: string,
                public statusCode: number,
                public details?: any) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.details = details;
    }
}
