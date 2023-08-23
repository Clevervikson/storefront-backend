import client from '../database';

export type Product = {
    id?: number;
    name: string;
    price: number;
    category: string;
};

export class ProductModel {
    async index(): Promise<Product[]> {
        try {
            const conn = await client!.connect();
            const sql = 'SELECT * FROM products';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Cannot get products & error = ${err}`);
        }
    }

    async show(id: number): Promise<Product> {
        try {
            const conn = await client!.connect();
            const sql = 'SELECT * FROM products WHERE id=($1)';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Cannot get product of id ${id} & error = ${err}`);
        }
    }

    async create(prod: Product): Promise<Product> {
        try {
            const conn = await client!.connect();
            const { name, price, category } = prod;
            const sql = `INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *`;

            const result = await conn.query(sql, [name, price, category]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not create new product & error= ${err}`);
        }
    }

    async update(id: number, price: number): Promise<Product> {
        try {
            const conn = await client!.connect();
            const sql = `UPDATE products SET price=($1) WHERE id=($2) RETURNING *`;
            const result = await conn.query(sql, [price, id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not update product status & ${err}`);
        }
    }

    async delete(id: number): Promise<Product> {
        try {
            const conn = await client!.connect();
            const sql = 'DELETE FROM products WHERE id=($1) RETURNING *';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(
                `Failed to delete product of id ${id}  & error: ${err}`
            );
        }
    }
}
