import Joi from 'joi';
import {NextFunction, Request, Response} from 'express';
import httpStatus from 'http-status';
import {JoiError} from '../errors/joi-error';

export const RequestBodyValidator = (schema: Joi.Schema) => (req: Request, res: Response, next: NextFunction) => {
    try {
        const {error} = schema.validate(req.body, {abortEarly: false})

        if (error) {
            const requiredField = error.details.map((element) => element.message)
            return next(new JoiError(httpStatus.BAD_REQUEST, httpStatus[`${httpStatus.BAD_REQUEST}_MESSAGE`], requiredField))
        }

        return next()
    } catch (error) {
        return next(error)
    }
}

export const RequestParamsValidator = (schema: Joi.Schema) => (req: Request, res: Response, next: NextFunction) => {
    try {
        const {error} = schema.validate(req.params, {abortEarly: false})
        if (error) {
            const requiredField = error.details.map((element) => element.message)
            return next(new JoiError(httpStatus.BAD_REQUEST, httpStatus[`${httpStatus.BAD_REQUEST}_MESSAGE`], requiredField))
        }

        return next()
    } catch (error) {
        return next(error)
    }
}

export const QueryParamsRequestValidator = (schema: Joi.Schema) => (req: Request, res: Response, next: NextFunction) => {
    try {
        const {error} = schema.validate(req.query, {abortEarly: false})

        if (error) {
            const requiredField = error.details.map((element) => element.message)
            return next(new JoiError(httpStatus.BAD_REQUEST, httpStatus[`${httpStatus.BAD_REQUEST}_MESSAGE`], requiredField))
        }

        return next()
    } catch (error) {
        return next(error)
    }
}
