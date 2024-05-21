import express from 'express'
import * as http from 'node:http';
import logger from '../config/winston.config'
import dotenv from 'dotenv'
import indexRouter from './routes/index.routes'
import processEnv from '../constants/env/env.constants';
import httpStatus from 'http-status';
import session from 'express-session';
import passport from 'passport';
import pgPool from '..//config/pg.config'
// @ts-ignore
import connPgSimple from 'connect-pg-simple'
import morgan from 'morgan'

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

app.use('/api', indexRouter)

app.use('*', (req, res) => {
    return res.status(httpStatus.NOT_FOUND).json({
        message: 'Not Found',
        error: httpStatus[httpStatus.NOT_FOUND],
        path: req.originalUrl
    })
})

async function startServer(): Promise<void> {
    const PORT = processEnv.PORT || 3000

    server.listen(PORT, () => {
        logger.info(`Server is running at http://localhost:${PORT}`)
    })

    function handleGracefulShutdown() {
        logger.info('Received kill signal, shutting down gracefully')
        pgPool.end() // Close the pg pool
        server.close(() => {
            logger.info('Closed out remaining connections')
            process.exit(0)
        })
    }

    process.on('SIGTERM', handleGracefulShutdown)
    process.on('SIGINT', handleGracefulShutdown)
}

startServer()
