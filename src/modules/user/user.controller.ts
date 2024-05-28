import {NextFunction, Request, Response} from 'express';
import httpStatus from 'http-status';
import userService from './user.service';

export class UserController {
    static async myProfile(req: Request, res: Response, next: NextFunction) {
        try {

            return res.status(httpStatus.OK).json({
                message: 'User profile fetched successfully',
                user: req.user,
            })
        } catch (err) {
            next(err);
        }
    }

    static async getFollowers(req: Request, res: Response, next: NextFunction) {
        try {
            // @ts-ignore
            const {id: userId} = req.user;

            const followers = await userService.getFollowers(userId);

            return res.status(httpStatus.OK).json({
                message: 'Followers fetched successfully',
                followers,
            });
        } catch (err) {
            next(err);
        }
    }

    static async getFollowing(req: Request, res: Response, next: NextFunction) {
        try {
            // @ts-ignore
            const {id: userId} = req.user;

            const following = await userService.getFollowing(userId);

            return res.status(httpStatus.OK).json({
                message: 'Following fetched successfully',
                following,
            });
        } catch (err) {
            next(err);
        }
    }

    static async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await userService.getAllUsers({
                limit: Number(req.query.limit),
                offset: Number(req.query.offset),
                search: req.query.search as string,
            });

            return res.status(httpStatus.OK).json({
                message: 'Users fetched successfully',
                users,
            });
        } catch (err) {
            next(err);
        }
    }

    static async getSingleUser(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = Number(req.params.userId);

            const user = await userService.getSingleUser(userId);

            return res.status(httpStatus.OK).json({
                message: 'User fetched successfully',
                user,
            });
        } catch (err) {
            next(err);
        }
    }

    static async getUserFollowers(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = Number(req.params.userId);

            const followers = await userService.getFollowers(userId);

            return res.status(httpStatus.OK).json({
                message: 'Followers fetched successfully',
                followers,
            });
        } catch (err) {
            next(err);
        }
    }

    static async getUserFollowing(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = Number(req.params.userId);

            const followings = await userService.getFollowing(userId);

            return res.status(httpStatus.OK).json({
                message: 'Following fetched successfully',
                followings,
            });
        } catch (err) {
            next(err);
        }
    }

    static async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = Number(req.params.userId);

            await userService.updateUser({
                userId,
                ...req.body
            })

            return res.status(httpStatus.OK).json({
                message: 'User updated successfully',
            })
        } catch (err) {
            next(err)
        }
    }

    static async forgotPassword(req: Request, res: Response, next: NextFunction) {
        try {
            await userService.forgotPassword(req.body.userIdentity)
            return res.status(httpStatus.OK).json({
                message: 'Forgot password link sent successfully',
            });
        } catch (err) {
            next(err);
        }
    }
}
