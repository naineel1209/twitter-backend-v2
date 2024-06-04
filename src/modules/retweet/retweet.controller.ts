import {NextFunction, Request, Response} from 'express';
import retweetService from './retweet.service';
import httpStatus from 'http-status';

export class RetweetController{
    static async retweet(req: Request, res: Response, next: NextFunction) {
        try{
            const {tweetId} = req.params;

            // @ts-ignore
            const {id: userId} = req.user;

            await retweetService.createRetweet(Number(tweetId), userId);

            return res.status(httpStatus.CREATED).json({
                message: 'Retweet created successfully'
            })
        }catch(error){
            next(error);
        }
    }

    static async undoRetweet(req: Request, res: Response, next: NextFunction) {
        try{
            const {tweetId} = req.params;

            // @ts-ignore
            const {id: userId} = req.user;

            await retweetService.undoRetweet(Number(tweetId), userId);

            return res.status(httpStatus.OK).json({
                message: 'Retweet undone successfully'
            })
        }catch(error){
            next(error);
        }
    }
}
