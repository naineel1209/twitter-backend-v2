import {Router} from 'express';
import passport from 'passport';
import {googleoauthStrategy} from './googleoauth.strategy';
import {passportDeSerializeCallback, passportSerializeCallback} from "./googleoauth.helper";

const router = Router()

//PATH: /api/auth/google-oauth

//instruct passport to use the Google strategy for 'google'
passport.use('google', googleoauthStrategy)

//serialize user will be called when the user is authenticated and the user object is stored in the session
passport.serializeUser(passportSerializeCallback)

//deserialize user will be called when the user is authenticated and the user object is stored in the session
passport.deserializeUser(passportDeSerializeCallback)

router.get('/', passport.authenticate('google', {
    accessType: 'offline',
    prompt: 'consent',
}))

router.get('/success', (req, res) => {
    return res.send({
        message: 'Google OAuth Success',
        user: req.user
    })
})

router.get('/failure', (req, res) => {
    return res.send('Google OAuth Failure')
})

router.get('/callback', passport.authenticate('google', {
    successRedirect: '/api/auth/google-oauth/success',
    failureRedirect: '/api/auth/google-oauth/failure',
}))

export default router;
