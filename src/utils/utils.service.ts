import {faker} from '@faker-js/faker/locale/en_IN';
import pg from 'pg';
import {TransactionStatment} from '../providers/transaction.statment';
import processEnv from '../../constants/env/env.constants';
import aesjs from 'aes-js';
import {fakerEN_IN} from '@faker-js/faker';
import bcrypt from 'bcrypt';

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

    static async encryptUserDetails(data: { userId: number, token: string }) {
        try {
            const key = Buffer.from(processEnv.ENCRYPTION_KEY); //128 bit = 16bytes
            const iv = Buffer.from(processEnv.ENCRYPTION_IV) //128 bit = 16bytes

            const dataText = JSON.stringify(data);
            const dataBytes = aesjs.utils.utf8.toBytes(dataText);

            // The counter is optional, and if omitted will begin at 1
            const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(iv)) //this will start the counter at 5 and the counter helps in generating the IV for the encryption process
            const encryptedBytes = aesCtr.encrypt(dataBytes)

            // To print or store the binary data, you may convert it to hex
            return aesjs.utils.hex.fromBytes(encryptedBytes);
        } catch (err) {
            throw err;
        }
    }

    static async decryptUserDetails(encryptedHex: string) {
        try {

            const key = Buffer.from(processEnv.ENCRYPTION_KEY); //128 bit = 16bytes
            const iv = Buffer.from(processEnv.ENCRYPTION_IV); //128 bit = 16bytes

            const encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);

            const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(iv))

            const decryptedBytes = aesCtr.decrypt(encryptedBytes)

            // Convert our bytes back into text
            const decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes)

            return JSON.parse(decryptedText);
        } catch (err) {
            throw err
        }
    }

    static async generateResetToken() {
        return fakerEN_IN.string.alphanumeric({
            length: 24,
            casing: 'lower',
        })
    }

    static async hashPassword(password: string) {
        return await bcrypt.hash(password, 12)
    }
}
