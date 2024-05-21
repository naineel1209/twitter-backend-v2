import pg from 'pg';
import logger from "./winston.config";

const pool = new pg.Pool({})

pool.on('error', (err, client) => {
    logger.error(`Unexpected error on idle client: ${err.message} ${err.stack}`)
})

export default pool;
