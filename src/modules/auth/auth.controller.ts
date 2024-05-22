import {NextFunction, Request, Response} from 'express';
import httpStatus from 'http-status';

export class AuthController {
    static async logoutController(req: Request, res: Response, next: NextFunction) {
        try {
            req.logout({
                keepSessionInfo: true,
            }, (err) => {
                if (err) {
                    return next(err);
                }
                return res.status(httpStatus.OK).json({message: 'Logged out successfully'});
            })
        }catch(error){
            next(error);
        }
    }
}
