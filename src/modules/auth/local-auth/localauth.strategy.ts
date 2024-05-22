import {Strategy as LocalStrategy} from 'passport-local';
import LocalAuthService from './localauth.service';
import bcrypt from 'bcrypt';

export const localAuthStrategy = new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    session: true,
    passReqToCallback: false,
}, async (username, password, done) => {
    const user = await LocalAuthService.findUserByUsername(username);

    const {id, username: dbUsername, password: dbPassword} = user;

    const verified = await bcrypt.compare(password, dbPassword);

    if (verified) {
        return done(null, {id, username: dbUsername});
    }else{
        return done(null, false, {
            message: 'Incorrect username or password'
        });
    }
})
