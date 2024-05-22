import {NextFunction, Request, Response} from 'express';

export const checkAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if(req.isAuthenticated()){
        return next();
    }
    return res.status(401).json({message: 'Unauthenticated'});
}
