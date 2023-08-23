import client from '../database';
import bcrypt from 'bcrypt';

const pepper = process.env.BCRYPT_PASSWORD as string;
const saltRounds = parseInt(process.env.SALT_ROUNDS as string);

export type User = {
    user_id?: number;
    first_name: string;
    last_name: string;
    password: string;
};

export class UserModel {
    async index(): Promise<User[]> {
        try {
            const conn = await client!.connect();
            const sql = 'SELECT * FROM users';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Unable to access errror ${err}`);
        }
    }

    async show(user_id: number): Promise<User> {
        try {
            const conn = await client!.connect();
            const sql = 'SELECT * FROM users WHERE user_id=($1)';
            const result = await conn.query(sql, [user_id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`unable to access id ${user_id} ${err}`);
        }
    }

    async create(user: User): Promise<User> {
        try {
            const conn = await client!.connect();
            const sql = `INSERT INTO users (first_name, last_name, password) VALUES($1, $2, $3) RETURNING *`;

            const hashPassCode = bcrypt.hashSync(
                user.password + pepper,
                saltRounds
            );
            const result = await conn.query(sql, [
                user.first_name,
                user.last_name,
                hashPassCode
            ]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not create new user & error = ${err}`);
        }
    }

    async update(user_id: number, password: string): Promise<User> {
        try {
            const conn = await client!.connect();
            const sql = `UPDATE users SET password=($1) WHERE user_id=($2) RETURNING *`;
            const result = await conn.query(sql, [password, user_id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not update user status & ${err}`);
        }
    }

    async delete(user_id: number): Promise<User> {
        try {
            const conn = await client!.connect();
            const sql = 'DELETE FROM users WHERE user_id=($1) RETURNING *';
            const result = await conn.query(sql, [user_id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(
                `Failed to delete user of id ${user_id}  & error: ${err}`
            );
        }
    }

    async authenticate(
        userName: string,
        password: string
    ): Promise<User | null> {
        try {
            const conn = await client!.connect();
            const sql = 'SELECT * FROM users WHERE first_name=($1)';
            const result = await conn.query(sql, [userName]);
            conn.release();
            const authUser = result.rows[0];
            if (authUser) {
                if (bcrypt.compareSync(password + pepper, authUser.password)) {
                    return authUser;
                }
            }
            return null;
        } catch (err) {
            throw new Error(
                `Failed to login in as ${userName}  & error: ${err}`
            );
        }
    }
}
