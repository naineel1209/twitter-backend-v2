import {faker} from '@faker-js/faker/locale/en_IN';
import pg from 'pg';
import {TransactionStatment} from '../providers/transaction.statment';

export class UtilsService {
    static async generateUsername(displayName: string) {
        const usernameArr = displayName.split(' ');
        let firstName = usernameArr[0], lastName = usernameArr[1];
        try {
            return faker.internet.userName({
                firstName: firstName,
                lastName: lastName,
            })
        } catch (error) {
            throw error
        }
    }

    static async transactionWrapper(client: pg.PoolClient, operations: any) {
        await client.query(TransactionStatment.BEGIN_WITH_SAVEPOINT)
        let opsResult;
        try {
            opsResult = await operations()

            await client.query(TransactionStatment.RELEASE_SAVEPOINT)
            await client.query(TransactionStatment.COMMIT)
        } catch (error) {
            await client.query(TransactionStatment.ROLLBACK_TO_SAVEPOINT)
            await client.query(TransactionStatment.ROLLBACK)
            throw error
        }

        return opsResult
    }
}
