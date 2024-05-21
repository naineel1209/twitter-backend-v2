import {faker} from '@faker-js/faker/locale/en_IN';

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
}
