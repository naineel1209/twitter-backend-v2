import {Router} from 'express';
import {RequestBodyValidator, RequestParamsValidator} from '../../providers/validator';
import {checkAuthenticated} from '../../middlewares/auth.middleware';
import {createTweetSchema, likeTweetParamSchema, unlikeTweetParamSchema, updateTweetSchema} from './tweet.validation';
import {TweetController} from './tweet.controller';

const router: Router = Router();

//Path: /api/tweet

router
    .post('/', checkAuthenticated, RequestBodyValidator(createTweetSchema), TweetController.createTweet)
    .patch('/:id', checkAuthenticated, RequestBodyValidator(updateTweetSchema), TweetController.updateTweet)
    .post('/:id/like', checkAuthenticated, RequestParamsValidator(likeTweetParamSchema), TweetController.likeTweet)
    .post('/:id/unlike', checkAuthenticated, RequestParamsValidator(unlikeTweetParamSchema), TweetController.unlikeTweet)

export default router;
