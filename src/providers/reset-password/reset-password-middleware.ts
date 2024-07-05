import {NextFunction, Request, Response} from 'express';
import resetPasswordService from './reset-password.service';
import {CustomError} from '../../errors/custom-error';
import httpStatus from 'http-status';

export const allowResetPasswordMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {userId} = req.body as { userId: number };

        const status = await resetPasswordService.checkUserPasswordUpdateStatus(userId);

        if (status) {
            await resetPasswordService.deleteUserPasswordUpdateStatus(userId); //delete the key from redis
            return next();
        }

        throw new CustomError('Password already updated', httpStatus.FORBIDDEN, {
            error: 'Password already updated',
            details: userId,
        });
    } catch (error) {
        return next(error);
    }
}
