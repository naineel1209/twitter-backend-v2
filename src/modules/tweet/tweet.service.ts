import pg from 'pg';
import {ICreateTweet, IUpdateTweet} from './tweet';
import {TweetDal} from './tweet.dal';
import pool from '../../../config/pg.config';
import {UtilsService} from '../../utils/utils.service';

class TweetService {
    constructor(private pgPool: pg.Pool) {
    }

    async createTweet(data: ICreateTweet) {
        const client = await this.pgPool.connect();
        try {
            return await TweetDal.createTweet(client, data);
        } catch (err) {
            throw err;
        } finally {
            client.release();
        }
    }

    async updateTweet(data: IUpdateTweet) {
        const client = await this.pgPool.connect();
        try {
            const tweet = await TweetDal.findTweetById(client, data.tweetId);

            if (!tweet) {
                throw new Error('Tweet not found');
            }

            if (tweet.user_id !== data.userId) {
                throw new Error('Unauthorized');
            }

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
            const tweet = await TweetDal.findTweetById(client, data.tweetId);

            if (!tweet) {
                throw new Error('Tweet not found');
            }

            const ops = async () => {
                let finalOpsResult = [];

                //update the tweet likes in the tweet table
                const updateTweetLike = await TweetDal.updateTweet(client, data);
                finalOpsResult.push(updateTweetLike);

                //insert the like in the likes table
                const insertLike = await TweetDal.insertLike(client, data);
                finalOpsResult.push(insertLike);

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

    async unlikeTweet(data: IUpdateTweet){
        const client = await this.pgPool.connect();

        try{
            const tweet = await TweetDal.findTweetById(client, data.tweetId);

            if(!tweet){
                throw new Error('Tweet not found');
            }

            const ops = async () => {
                let finalOpsResult = [];

                //update the tweet likes in the tweet table
                const updateTweetLike = await TweetDal.updateTweet(client, data);
                finalOpsResult.push(updateTweetLike);

                //delete the like entry from the likes table
                const deleteLike = await TweetDal.deleteLike(client, data);
                finalOpsResult.push(deleteLike);

                return finalOpsResult;
            }

            const finalOpsResult = await UtilsService.transactionWrapper(client, ops);

            return finalOpsResult[0]; //0th index will always be the updated tweet
        }catch(err){
            throw err;
        }finally{
            client.release();
        }
    }
}

export default new TweetService(pool)
