import {faker} from '@faker-js/faker/locale/en_IN';
import pg from 'pg';
import {TransactionStatment} from '../providers/transaction.statment';
import processEnv from '../../constants/env/env.constants';
import aesjs from 'aes-js';
import {fakerEN_IN} from '@faker-js/faker';

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

    static stringToArrayBuffer(str: string) {
        // Create a TextEncoder
        const encoder = new TextEncoder();

        // Encode the string into a Uint8Array
        const uint8Array = encoder.encode(str);

        // Return the underlying ArrayBuffer
        return uint8Array.buffer;
    }

    static async encryptUserDetails(data: { userId: number }) {
        try {
            const key = processEnv.ENCRYPTION_KEY; //128 bit = 16bytes
            const iv = Buffer.from(processEnv.ENCRYPTION_IV) //128 bit = 16bytes

            const dataText = JSON.stringify(data);
            const dataBytes = aesjs.utils.utf8.toBytes(dataText);

            // The counter is optional, and if omitted will begin at 1
            const aesCtr = new aesjs.ModeOfOperation.ctr(this.stringToArrayBuffer(key), new aesjs.Counter(iv)) //this will start the counter at 5 and the counter helps in generating the IV for the encryption process
            const encryptedBytes = aesCtr.encrypt(dataBytes)

            // To print or store the binary data, you may convert it to hex
            return aesjs.utils.hex.fromBytes(encryptedBytes);
        } catch (err) {
            throw err;
        }
    }

    static async decryptUserDetails(encryptedHex: string) {
        try {
            const key = processEnv.ENCRYPTION_KEY; //128 bit = 16bytes
            const iv = Buffer.from(processEnv.ENCRYPTION_IV); //128 bit = 16bytes

            const encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);

            const aesCtr = new aesjs.ModeOfOperation.ctr(this.stringToArrayBuffer(key), new aesjs.Counter(iv))

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
}
