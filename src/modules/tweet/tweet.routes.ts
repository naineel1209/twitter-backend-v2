import {Router} from 'express';
import {RequestBodyValidator, RequestParamsValidator} from '../../providers/validator';
import {checkAuthenticated} from '../../middlewares/auth.middleware';
import {
    createTweetSchema,
    likeTweetParamSchema,
    unlikeTweetParamSchema,
    updateTweetParamSchema,
    updateTweetSchema
} from './tweet.validation';
import {TweetController} from './tweet.controller';

const router: Router = Router();

//Path: /api/tweet

router
    .get('/feed', TweetController.getFeed)
    .post('/', checkAuthenticated, RequestBodyValidator(createTweetSchema), TweetController.createTweet)
    .patch('/:id', checkAuthenticated, RequestBodyValidator(updateTweetSchema), RequestParamsValidator(updateTweetParamSchema), TweetController.updateTweet)
    .post('/:id/like', checkAuthenticated, RequestParamsValidator(likeTweetParamSchema), TweetController.likeTweet)
    .post('/:id/unlike', checkAuthenticated, RequestParamsValidator(unlikeTweetParamSchema), TweetController.unlikeTweet)
    .delete('/:id', checkAuthenticated, RequestParamsValidator(unlikeTweetParamSchema), TweetController.deleteTweet)

export default router;
