import {Router} from 'express';
import passport from 'passport';
import {googleoauthStrategy} from './googleoauth.strategy';

const router: Router = Router()

//PATH: /api/auth/google-oauth

//instruct passport to use the Google strategy for 'google'
passport.use('google', googleoauthStrategy)

router.get('/', passport.authenticate('google', {
    accessType: 'offline',
    prompt: 'consent',
}))

router.get('/callback', passport.authenticate('google', {
    successRedirect: '/api/auth/google-oauth/success',
    failureRedirect: '/api/auth/google-oauth/failure',
}))

router.get('/success', (req, res) => {
    return res.send({
        message: 'Google OAuth Success',
        user: req.user,
        flag: req.isAuthenticated() // true
    })
})

router.get('/failure', (req, res) => {
    return res.send('Google OAuth Failure')
})


export default router;
