import {NextFunction, Request, Response} from 'express';
import {ILocalUserObj} from './localauth';
import localAuthService from './localauth.service';
import httpStatus from 'http-status';

export class LocalAuthController {
    static async localRegister(req: Request, res: Response, next: NextFunction) {
        try {
            const {username, name, email, password}: ILocalUserObj = req.body;

            const userExists = await localAuthService.findUserByUsername(username);

            if (userExists) {
                //TODO Custom Error Class Implementation
                return res.status(httpStatus.BAD_REQUEST).json({message: 'User already exists'});
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
