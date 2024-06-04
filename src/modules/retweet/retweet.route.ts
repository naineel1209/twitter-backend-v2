import {Router} from 'express';
import {checkAuthenticated} from '../../middlewares/auth.middleware';
import {RetweetController} from './retweet.controller';
import {RequestParamsValidator} from '../../providers/validator';
import {createRetweetSchema, undoRetweetSchema} from './retweet.validation';

const router: Router = Router();

//PATH: /api/retweet

router
    .post('/:tweetId', checkAuthenticated, RequestParamsValidator(createRetweetSchema), RetweetController.retweet)
    .delete('/:tweetId', checkAuthenticated, RequestParamsValidator(undoRetweetSchema), RetweetController.undoRetweet)

export default router;
