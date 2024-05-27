import {Router} from 'express';
import {authRouter, followerRouter, tweetRouter, userRouter} from '../modules/';

const router: Router = Router()

router.get('/', (req, res) => {
    return res.send('Hello World!')
})

router.use('/auth', authRouter)

router.use('/tweet', tweetRouter)

router.use('/follower', followerRouter)

router.use('/user', userRouter)

export default router
