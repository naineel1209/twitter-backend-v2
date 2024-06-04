import {Router} from 'express';
import {authRouter, followerRouter, retweetRouter, tweetRouter, userRouter} from '../modules/';

const router: Router = Router()

router.get('/', (req, res) => {
    return res.send('Hello World!')
})

router.use('/auth', authRouter)

router.use('/tweet', tweetRouter)

router.use('/follower', followerRouter)

router.use('/user', userRouter)

router.use('/retweet', retweetRouter)

export default router
