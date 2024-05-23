import {NextFunction, Request, Response} from 'express';
import {CustomError} from '../errors/custom-error';
import httpStatus from 'http-status';

export const checkAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    }
    throw new CustomError('Unauthorized', httpStatus.UNAUTHORIZED, {
        message: 'You are not authorized to access this resource',
        path: req.originalUrl
    })
}
