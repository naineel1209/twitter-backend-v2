import winston from 'winston';
import path from 'node:path';
import axios from 'axios';
import processEnv from '../constants/env/env.constants';


const filePath = path.join(__dirname, '../logs');

const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.printf(info => {
        return `[${info.timestamp}] == ${info.level} :: ${info.message}`;
    }));

const fileFormat = winston.format.combine(
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.printf(info => {
        return `[${info.timestamp}] == ${info.level} :: ${info.message}`;
    }), winston.format.uncolorize());

const logger = winston.createLogger({
    levels: winston.config.syslog.levels,
});

const logErrorDiscord = async (error: any) => {
    // log the error to discord
    // create an object to be sent to discord

    const errorObject: {
        message: string,
        description: string,
        color: number,
        timestamp: string,
        footer: {
            text: string,
        },
        author: {
            name: string,
        },
        type: string,
    } = {
        message: '',
        description: '',
        color: 0,
        timestamp: '',
        footer: {
            text: ''
        },
        author: {
            name: ''
        },
        type: ''
    };

    if (error instanceof Error) {
        errorObject['message'] = `Error - ${error.message}`;
        errorObject['description'] = JSON.stringify(error.stack, null, 2);
        errorObject['color'] = 16711680;
        errorObject['timestamp'] = new Date().toISOString();
        errorObject['footer'] = {
            text: 'Twitter Backend V2',
        };
        errorObject['author'] = {
            name: 'Twitter Backend V2',
        };
        errorObject['type'] = 'rich';
    } else {
        errorObject['message'] = `Error - ${error}`;
        errorObject['description'] = JSON.stringify(error, null, 2);
        errorObject['color'] = 16711680;
        errorObject['timestamp'] = new Date().toISOString();
        errorObject['footer'] = {
            text: 'Twitter Backend V2',
        };
        errorObject['author'] = {
            name: 'Twitter Backend V2',
        };
        errorObject['type'] = 'rich';
    }

    await axios.post(<string>processEnv.DISCORD_WEBHOOK, {
        embeds: [errorObject],
    }, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

const customLogger = (oldLogger: winston.LeveledLogMethod) => (error: any) => {
    // log the error to normal logger
    oldLogger(error);

    // log the error to discord
    logErrorDiscord(error)
        .then(() => {
            return oldLogger;
        })
    ;
}

if (processEnv.CONSOLE_LOG === 'true') {
    logger.add(new winston.transports.Console({
        format: consoleFormat,
    }));
}

if (processEnv.FILE_LOG === 'true') {
    logger.add(new winston.transports.File({filename: `${filePath}/combined.log`, format: fileFormat}));
    logger.add(new winston.transports.File({filename: `${filePath}/errors.log`, level: 'error', format: fileFormat}));
}

if (processEnv.DISCORD_LOG === 'true') {
    logger.error = customLogger(logger.error) as any;
}

export default logger;
