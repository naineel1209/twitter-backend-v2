import pg from 'pg';

export class AuthDal{
    static async findUserById(client: pg.PoolClient, id: number){
        try {
            //1. Write a query to find a user by id
            const userByIdQuery = {
                text: 'SELECT * FROM users WHERE id = $1',
                values: [id]
            };

            //2. Execute the query
            const result = await client.query(userByIdQuery)

            //3. Return the user
            return result.rows[0]
        } catch (error) {
            throw error
        }
    }
}
