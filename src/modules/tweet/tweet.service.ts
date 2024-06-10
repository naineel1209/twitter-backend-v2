import pg from 'pg';
import {ICreateTweet, IGetFeed, IGetFollowingFeed, IQuoteTweet, IUpdateTweet} from './tweet';
import {TweetDal} from './tweet.dal';
import pool from '../../../config/pg.config';
import {UtilsService} from '../../utils/utils.service';
import {UserDal} from '../user/user.dal';

class TweetService {
    constructor(private pgPool: pg.Pool) {
    }

    async getFeed(userId: number, feedQuery: IGetFeed) {
        const client = await this.pgPool.connect();
        try {
            return await TweetDal.getFeed(client, userId, feedQuery);
        } catch (err) {
            throw err;
        } finally {
            client.release();
        }
    }

    async createTweet(data: ICreateTweet) {
        const client = await this.pgPool.connect();
        try {
            const ops = async () => {
                const finalOpsResult = [];

                //insert the tweet in the tweet table
                const createdTweet = await TweetDal.createTweet(client, data);
                finalOpsResult.push(createdTweet);

                //update the tweets count in the user table
                const updatedUser = await UserDal.updateUser(client, {userId: data.userId, tweets_count: true})
                finalOpsResult.push(updatedUser);

                return finalOpsResult;
            }

            //use the transaction wrapper to wrap the transaction operations
            const finalOpsResult = await UtilsService.transactionWrapper(client, ops);

            return finalOpsResult[0]; //0th index will always be the created tweet
        } catch (err) {
            throw err;
        } finally {
            client.release();
        }
    }

    async updateTweet(data: IUpdateTweet) {
        const client = await this.pgPool.connect();
        try {
            return await TweetDal.updateTweet(client, data)
        } catch (err) {
            throw err;
        } finally {
            client.release();
        }
    }

    async likeTweet(data: IUpdateTweet) {
        const client = await this.pgPool.connect();

        try {

            const ops = async () => {
                let finalOpsResult = [];

                //update the tweet likes in the tweet table
                const updateTweetLike = await TweetDal.updateTweet(client, data);
                finalOpsResult.push(updateTweetLike);

                //insert the like in the likes table
                const insertLike = await TweetDal.insertLike(client, data);
                finalOpsResult.push(insertLike);

                //update the liked_tweets_count in the user table
                const updateUserLikedTweetsCount = await UserDal.updateUser(client, {
                    userId: data.userId as number,
                    liked_tweets_count: true
                });
                finalOpsResult.push(updateUserLikedTweetsCount);

                return finalOpsResult;
            }

            //transaction wrapper to handle the transaction operations
            const finalOpsResult = await UtilsService.transactionWrapper(client, ops);

            return finalOpsResult[0]; //0th index will always be the updated tweet
        } catch (err) {
            throw err;
        } finally {
            client.release();
        }
    }

    async unlikeTweet(data: IUpdateTweet) {
        const client = await this.pgPool.connect();

        try {

            const ops = async () => {
                let finalOpsResult = [];

                //update the tweet likes in the tweet table
                const updateTweetLike = await TweetDal.updateTweet(client, data);
                finalOpsResult.push(updateTweetLike);

                //delete the like entry from the likes table
                const deleteLike = await TweetDal.deleteLike(client, data);
                finalOpsResult.push(deleteLike);

                //update the liked_tweets_count in the user table
                await UserDal.updateUser(client, {
                    userId: data.userId as number,
                    liked_tweets_count: false
                });

                return finalOpsResult;
            }

            const finalOpsResult = await UtilsService.transactionWrapper(client, ops);

            return finalOpsResult[0]; //0th index will always be the updated tweet
        } catch (err) {
            throw err;
        } finally {
            client.release();
        }
    }

    async deleteTweet(data: IUpdateTweet) {
        const client = await this.pgPool.connect();

        try {

            const ops = async () => {
                const finalOpsResult = [];

                //delete the tweet in the tweet table
                const deletedTweet = await TweetDal.updateTweet(client, data); //delete: true in data
                finalOpsResult.push(deletedTweet);

                //update the tweets count in the user table
                const updatedUser = await UserDal.updateUser(client, {userId: data.userId as number, tweets_count: false})
                finalOpsResult.push(updatedUser);

                //if the tweet is a quote tweet, update the quote_tweets count in the tweet table
                if(deletedTweet.attachment_tweet_id !== null) {
                    const updatedTweet = await TweetDal.updateTweet(client, {tweetId: deletedTweet.attachment_tweet_id, quote: false});
                    finalOpsResult.push(updatedTweet);
                }

                return finalOpsResult;
            }

            //use the transaction wrapper to wrap the transaction operations
            const finalOpsResult = await UtilsService.transactionWrapper(client, ops);

            return finalOpsResult[0]; //0th index will always be the created tweet
        } catch (err) {
            throw err;
        } finally {
            client.release();
        }
    }

    async getFollowingFeed(userId: number, feedQuery: IGetFollowingFeed) {
        const client = await this.pgPool.connect();
        try {
            return await TweetDal.getFollowingFeed(client, userId, feedQuery);
        } catch (err) {
            throw err;
        } finally {
            client.release();
        }
    }

    async getTweet(tweetId: number) {
        const client = await this.pgPool.connect();
        try {
            return await TweetDal.getTweet(client, tweetId);
        } catch (err) {
            throw err;
        } finally {
            client.release();
        }
    }

    async quoteTweet(data: IQuoteTweet) {
        const client = await this.pgPool.connect();
        try {
            const ops = async () => {
                const finalOpsResult = [];

                //insert the tweet in the tweet table
                const createdTweet = await TweetDal.createTweet(client, data);
                finalOpsResult.push(createdTweet);

                //update the tweets count in the user table
                const updatedUser = await UserDal.updateUser(client, {userId: data.userId, tweets_count: true})
                finalOpsResult.push(updatedUser);

                //update the quote_tweets count in the tweet table
                await TweetDal.updateTweet(client, {tweetId: data.attachmentTweetId, quote: true});
                return finalOpsResult;
            }

            //use the transaction wrapper to wrap the transaction operations
            const finalOpsResult = await UtilsService.transactionWrapper(client, ops);

            return finalOpsResult[0]; //0th index will always be the created tweet
        } catch (err) {
            throw err;
        } finally {
            client.release();
        }
    }

    async getTweetEngagements(tweetId: number) {
        const client = await this.pgPool.connect();
        try {
            return await TweetDal.getTweetEngagements(client, tweetId);
        } catch (err) {
            throw err;
        } finally {
            client.release();
        }
    }
}

export default new TweetService(pool)
