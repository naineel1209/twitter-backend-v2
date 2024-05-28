import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import transporter from '../../../config/nodemailer.config';
import {ISendMail} from './mail';

class MailService {
    constructor(private mailer: nodemailer.Transporter<SMTPTransport.SentMessageInfo>) {
    }

    async sendMail(to: string, subject: string, text: string) {
        try {
            await this.mailer.sendMail({
                from: process.env.EMAIL,
                to,
                subject,
                html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        /* Global Styles */
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
        }
        
        .container {
            max-width: 400px;
            margin: 40px auto;
            text-align: center;
            padding: 20px;
            border: 1px solid #ddd;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background-color: #333;
            color: #fff;
            padding: 10px;
            text-align: center;
            border-bottom: 1px solid #333;
        }
        
        .content {
            padding: 20px;
        }
        
        .button {
            background-color: #4CAF50;
            color: #fff;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        
        .button:hover {
            background-color: #3e8e41;
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>Reset Your Password</h1>
        </header>
        <main class="content">
            <p>Hello, we've received your request to reset your password. Please follow the steps below to create a new one:</p>
            <ul>
                <li><strong>Step 1:</strong> Click on the link below to generate a new password.</li>
                <li><strong>Step 2:</strong> Create a new strong password using our recommended guidelines (at least 12 characters, including uppercase and lowercase letters, numbers, and special characters).</li>
                <li><strong>Step 3:</strong> Enter your new password and confirm it.</li>
            </ul>
            <a href="#" class="button">Reset Password Now!</a>
        </main>
    </div>
</body>
</html>`
            })
        } catch (err) {
            throw err;
        }
    }

    async sendForgotPasswordMail(data: ISendMail) {
    }
}

export default new MailService(transporter)
