import {Router} from 'express';
import {QueryParamsRequestValidator, RequestBodyValidator, RequestParamsValidator} from '../../providers/validator';
import {checkAuthenticated} from '../../middlewares/auth.middleware';
import {
    createTweetSchema,
    getFeedQuerySchema,
    getFollowingFeedQuerySchema,
    getTweetParamSchema,
    likeTweetParamSchema,
    quoteTweetBodySchema,
    quoteTweetParamSchema,
    unlikeTweetParamSchema,
    updateTweetParamSchema,
    updateTweetSchema
} from './tweet.validation';
import {TweetController} from './tweet.controller';

const router: Router = Router();

//Path: /api/tweet

router
    .get('/feed', QueryParamsRequestValidator(getFeedQuerySchema), TweetController.getFeed)
    .get('/feed/following', checkAuthenticated, QueryParamsRequestValidator(getFollowingFeedQuerySchema), TweetController.getFollowingFeed)
    .post('/', checkAuthenticated, RequestBodyValidator(createTweetSchema), TweetController.createTweet)
    .get('/:id', RequestParamsValidator(getTweetParamSchema), TweetController.getTweet)
    .patch('/:id', checkAuthenticated, RequestBodyValidator(updateTweetSchema), RequestParamsValidator(updateTweetParamSchema), TweetController.updateTweet)
    .post('/:id/like', checkAuthenticated, RequestParamsValidator(likeTweetParamSchema), TweetController.likeTweet)
    .post('/:id/unlike', checkAuthenticated, RequestParamsValidator(unlikeTweetParamSchema), TweetController.unlikeTweet)
    .delete('/:id', checkAuthenticated, RequestParamsValidator(unlikeTweetParamSchema), TweetController.deleteTweet)
    .post('/:tweetId/quote', checkAuthenticated, RequestParamsValidator(quoteTweetParamSchema), RequestBodyValidator(quoteTweetBodySchema), TweetController.quoteTweet)
    .get('/:tweetId/post-engagements', TweetController.getTweetEngagements)

export default router;
