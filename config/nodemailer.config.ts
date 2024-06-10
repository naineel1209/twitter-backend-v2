import nodemailer from 'nodemailer';
import processEnv from '../constants/env/env.constants';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587, //default port for secure SMTP
    secure: false,

    auth: {
        user: processEnv.EMAIL,
        pass: processEnv.APP_PASSWORD
    }
});

export default transporter;
