import {Router} from 'express';
import {authRouter, tweetRouter} from '../modules/';

const router: Router = Router()

router.get('/', (req, res) => {
    return res.send('Hello World!')
})

router.use('/auth', authRouter)

router.use("/tweet", tweetRouter)

export default router
