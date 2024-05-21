import {Router} from 'express';
import authRouter from '../modules/auth/auth.routes';

const router = Router()

router.get('/', (req, res) => {
    return res.send('Hello World!')
})

router.use('/auth', authRouter)

export default router
