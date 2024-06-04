import pg from 'pg';
import pool from '../../../config/pg.config';
import {RetweetDal} from './retweet.dal';
import {TweetDal} from '../tweet/tweet.dal';
import {UtilsService} from '../../utils/utils.service';

class RetweetService {
    constructor(private pgPool: pg.Pool) {
        this.pgPool = pgPool;
    }

    async createRetweet(tweetId: number, userId: number) {
        const client = await this.pgPool.connect();

        try {
            const ops = async () => {
                const finalOpsResult = [];

                //insert the retweet in the retweet table
                const createdRetweet = await RetweetDal.createRetweet(client, tweetId, userId);
                finalOpsResult.push(createdRetweet);

                //update the retweets count in the tweet table
                const updatedTweet = await TweetDal.updateTweet(client, {tweetId, retweet: true});
                finalOpsResult.push(updatedTweet);

                return finalOpsResult;
            }

            const finalOpsResult = await UtilsService.transactionWrapper(client, ops);

            return finalOpsResult[0];
        } catch (err) {
            throw err;
        } finally {
            client.release();
        }
    }

    async undoRetweet(tweetId: number, userId: number) {
        const client = await this.pgPool.connect();

        try {
            const ops = async () => {
                const finalOpsResult = [];

                    //delete the retweet from the retweet table
                    const deletedRetweet = await RetweetDal.undoRetweet(client, tweetId, userId);
                    finalOpsResult.push(deletedRetweet);

                    //update the retweets count in the tweet table
                    const updatedTweet = await TweetDal.updateTweet(client, {tweetId, retweet: false});
                    finalOpsResult.push(updatedTweet);

                    return finalOpsResult;
            }

            const finalOpsResult = await UtilsService.transactionWrapper(client, ops);

            return finalOpsResult[0];
        } catch (err) {
            throw err;
        } finally {
            client.release();
        }
    }
}

export default new RetweetService(pool)
