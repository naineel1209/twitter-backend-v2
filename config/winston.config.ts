import winston from 'winston';
import path from 'node:path';

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
    transports: [
        new winston.transports.Console({
            format: consoleFormat,
        }),
        new winston.transports.File({filename: `${filePath}/errors.log`, level: 'error', format: fileFormat}),
        new winston.transports.File({filename: `${filePath}/combined.log`, format: fileFormat})
    ]
});

export default logger;
