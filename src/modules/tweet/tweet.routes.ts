import {Router} from 'express';
import {RequestBodyValidator} from '../../providers/validator';
import {checkAuthenticated} from '../../middlewares/auth.middleware';
import {createTweetSchema, updateTweetSchema} from './tweet.validation';
import {TweetController} from './tweet.controller';

const router: Router = Router();

//Path: /api/tweet

router
    .post('/', checkAuthenticated, RequestBodyValidator(createTweetSchema), TweetController.createTweet)
    .patch('/:id', checkAuthenticated, RequestBodyValidator(updateTweetSchema), TweetController.updateTweet)
    .post('/:id/like', checkAuthenticated, TweetController.likeTweet)

export default router;
