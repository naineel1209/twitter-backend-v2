import {NextFunction, Request, Response} from 'express';
import tweetService from './tweet.service';
import httpStatus from 'http-status';

export class TweetController {
    static async getFeed(req: Request, res: Response, next: NextFunction) {
        try {
            let userId = -1;
            if (req.user) {
                // @ts-ignore
                userId = req.user.id;
            }

            const feed = await tweetService.getFeed(userId, req.query);

            return res.status(httpStatus.OK).json({
                message: 'Feed fetched successfully',
                feed
            })
        } catch (err) {
            next(err);
        }
    }

    static async createTweet(req: Request, res: Response, next: NextFunction) {
        try {
            // @ts-ignore
            const {id: userId} = req.user;
            const {tweet} = req.body;

            const createdTweet = await tweetService.createTweet({userId, tweet});

            return res.status(httpStatus.CREATED).json({
                message: 'Tweet created successfully',
                tweet: createdTweet.id,
            })
        } catch (err) {
            next(err);
        }
    }

    static async updateTweet(req: Request, res: Response, next: NextFunction) {
        try {
            // @ts-ignore
            const {id: userId} = req.user;
            const {id} = req.params;
            const {tweet} = req.body;

            const updatedTweet = await tweetService.updateTweet({userId, tweet, tweetId: Number(id)});

            return res.status(httpStatus.OK).json({
                message: 'Tweet updated successfully',
                tweet: updatedTweet
            })
        } catch (err) {
            next(err);
        }
    }

    static async likeTweet(req: Request, res: Response, next: NextFunction) {
        try {
            // @ts-ignore
            const {id: userId} = req.user;
            const {id} = req.params;

            const likedTweet = await tweetService.likeTweet({userId, tweetId: Number(id), like: true});

            return res.status(httpStatus.OK).json({
                message: 'Tweet liked successfully',
                tweet: likedTweet
            })
        } catch (err) {
            next(err);
        }
    }

    static async unlikeTweet(req: Request, res: Response, next: NextFunction) {
        try {
            // @ts-ignore
            const {id: userId} = req.user;
            const {id} = req.params;

            const unlikedTweet = await tweetService.unlikeTweet({userId, tweetId: Number(id), like: false});

            return res.status(httpStatus.OK).json({
                message: 'Tweet unliked successfully',
                tweet: unlikedTweet
            })
        } catch (err) {
            next(err);
        }
    }

    static async deleteTweet(req: Request, res: Response, next: NextFunction) {
        try {
            // @ts-ignore
            const {id: userId} = req.user
            const {id} = req.params;

            await tweetService.deleteTweet({userId, tweetId: Number(id), delete: true})

            return res.status(httpStatus.OK).json({
                message: 'Tweet deleted successfully'
            })
        } catch (err) {
            next(err);
        }
    }

    static async getFollowingFeed(req: Request, res: Response, next: NextFunction) {
        try {
            // @ts-ignore
            const {id: userId} = req.user;

            const feed = await tweetService.getFollowingFeed(userId, req.query);

            return res.status(httpStatus.OK).json({
                message: 'Following feed fetched successfully',
                feed
            })
        } catch (err) {
            next(err);
        }
    }

    static async getTweet(req: Request, res: Response, next: NextFunction) {
        try {
            const {tweetId} = req.params;

            const tweet = await tweetService.getTweet(Number(tweetId));

            if (tweet === null || tweet === undefined) {
                return res.status(httpStatus.NOT_FOUND).json({
                    message: 'Tweet not found'
                });
            }

            return res.status(httpStatus.OK).json({
                message: 'Tweet fetched successfully',
                tweet
            });
        } catch (err) {
            next(err);
        }
    }
}
