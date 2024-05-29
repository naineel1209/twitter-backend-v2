import {NextFunction, Request, Response} from 'express';
import {ILocalUserObj} from './localauth';
import localAuthService from './localauth.service';
import httpStatus from 'http-status';
import {CustomError} from '../../../errors/custom-error';

export class LocalAuthController {
    static async localRegister(req: Request, res: Response, next: NextFunction) {
        try {
            const {username, name, email, password}: ILocalUserObj = req.body;

            const userExists = await localAuthService.findUserByUsername(username);

            if (userExists) {
                throw new CustomError('User already exists', httpStatus.CONFLICT, {
                    message: 'User already exists with this username',
                    username,
                    path: req.originalUrl,
                })
            }

            const newUser = await localAuthService.registerLocalUser({username, name, email, password});

            return res.status(httpStatus.CREATED).json({
                message: 'User created successfully',
                data: newUser
            })
        } catch (error) {
            next(error);
        }
    }

    static success(req: Request, res: Response) {
        return res.status(httpStatus.OK).json({
            message: 'Login successful',
            data: req.user
        })
    }

    static failure(req: Request, res: Response) {
        return res.status(httpStatus.UNAUTHORIZED).json({
            message: 'Login failed'
        })
    }
}
