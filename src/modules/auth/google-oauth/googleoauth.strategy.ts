import {GoogleCallbackParameters, Profile, Strategy as GoogleStrategy, VerifyCallback} from 'passport-google-oauth20';
import processEnv from '../../../../constants/env/env.constants';
import {CALLBACK_URL, GOOGLE_SCOPES} from '../../../../constants/constants';

export const googleoauthStrategy = new GoogleStrategy({
    clientID: processEnv.GOOGLE_CLIENT_ID,
    clientSecret: processEnv.GOOGLE_CLIENT_SECRET,
    callbackURL: CALLBACK_URL,
    scope: GOOGLE_SCOPES,
}, (accessToken: string,
    refreshToken: string,
    params: GoogleCallbackParameters,
    profile: Profile,
    done: VerifyCallback,) => {

    console.log('Google OAuth Strategy')
    console.log(profile)
    console.log(params)
    console.log(accessToken)
    console.log(refreshToken)

    return done(null, profile)
})
