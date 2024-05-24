import express, {NextFunction} from 'express'
import * as http from 'node:http';
import logger from '../config/winston.config'
import dotenv from 'dotenv'
import indexRouter from './routes/index.route'
import processEnv from '../constants/env/env.constants';
import httpStatus from 'http-status';
import session from 'express-session';
import passport from 'passport';
import pgPool from '..//config/pg.config'
// @ts-ignore
import connPgSimple from 'connect-pg-simple'
import morgan from 'morgan'
import {JoiError} from './errors/joi-error';
import {passportDeSerializeCallback, passportSerializeCallback} from './modules/auth/auth.helper';
import {CustomError} from './errors/custom-error';

dotenv.config()

const app = express()
const server = http.createServer(app)

const ConnectPgSimple = connPgSimple(session)
const pgSessionStore = new ConnectPgSimple({
    pool: pgPool,
    tableName: 'user_session',
    createTableIfMissing: true,
    errorLog: (err: any) => {
        logger.error(err)
    }
})

app.use(morgan('dev', {
    stream: {
        write: (message: string) => {
            logger.info(message)
        }
    }
}))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
app.use(session({
    secret: processEnv.JWT_SECRET,
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    cookie: {maxAge: 7 * 24 * 60 * 60 * 1000}, // 1 week
    name: 'twitter-session-id',
    store: pgSessionStore
}))
app.use(passport.session())

//serialize user will be called when the user is authenticated and the user object is stored in the session
passport.serializeUser(passportSerializeCallback)

//deserialize user will be called when the user is authenticated and the user object is stored in the session
passport.deserializeUser(passportDeSerializeCallback)

app.use('/api', indexRouter)

app.use('*', (req, res) => {
    return res.status(httpStatus.NOT_FOUND).json({
        message: 'Not Found',
        error: httpStatus[httpStatus.NOT_FOUND],
        path: req.originalUrl
    })
})

app.use((err: unknown, req: express.Request, res: express.Response, _: NextFunction) => {
    if (err instanceof JoiError) {
        logger.error(err.message)
        return res.status(err.code).json({
            message: err.message,
            error: processEnv.NODE_ENV === 'development' ? err.stack : ''
        })
    } else if (err instanceof CustomError) {
        logger.error(err.message)
        return res.status(err.statusCode).json({
            message: err.message,
            stack: processEnv.NODE_ENV === 'development' ? err.stack : '',
            details: processEnv.NODE_ENV === 'development' ? err.details : '',
        });
    } else if (err instanceof Error) {
        logger.error(err.message)
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Internal Server Error',
            error: err.message
        })
    } else {
        logger.error(err)
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Internal Server Error',
            error: 'Internal Server Error'
        })

    }
})

function startServer(): void {
    const PORT = processEnv.PORT || 3000

    server.listen(PORT, () => {
        logger.info(`Server is running at http://localhost:${PORT}`)
    })

    async function handleGracefulShutdown() {
        logger.info('Received kill signal, shutting down gracefully')
        await pgPool.end() // Close the pg pool
        server.close(() => {
            logger.info('Closed out remaining connections')
            process.exit(0)
        })
    }

    process.on('SIGTERM', handleGracefulShutdown)
    process.on('SIGINT', handleGracefulShutdown)
}

startServer()
