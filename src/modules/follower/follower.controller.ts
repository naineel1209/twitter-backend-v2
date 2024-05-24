import {NextFunction, Request, Response} from 'express';
import followerService from './follower.service';
import httpStatus from 'http-status';

export class FollowerController {
    static async followUser(req: Request, res: Response, next: NextFunction) {
        try {
            //@ts-ignore
            const {id: userId} = req.user;
            const {followUserId} = req.params;

            const followUser = await followerService.followUser({
                userId: Number(userId),
                followUserId: Number(followUserId)
            });

            return res.status(httpStatus.CREATED).json({
                message: 'User followed successfully',
            })
        } catch (err) {
            next(err)
        }
    }

    static async unfollowUser(req: Request, res: Response, next: NextFunction) {
        try {
            //@ts-ignore
            const {id: userId} = req.user;
            const {followUserId} = req.params;

            const followUser = await followerService.unfollowUser({
                userId: Number(userId),
                followUserId: Number(followUserId)
            });

            return res.status(httpStatus.CREATED).json({
                message: 'User unfollowed successfully',
            })
        } catch (err) {
            next(err)
        }
    }
}
