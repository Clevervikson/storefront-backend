import client from '../database';

export type Order = {
    user_id: number;
    order_id?: number;
    order_status: string;
};

export class OrdersModel {
    async index(): Promise<Order[]> {
        const conn = await client!.connect();
        try {
            const sqlQuery = 'SELECT * FROM orders';
            const result = await conn.query(sqlQuery);
            return result.rows;
        } catch (err) {
            throw new Error(`Cannot get orders: ${err}`);
        } finally {
            conn.release();
        }
    }

    async show(order_id: number): Promise<Order> {
        const conn = await client!.connect();
        try {
            const sqlQuery = 'SELECT * FROM orders WHERE order_id = $1';
            const result = await conn.query(sqlQuery, [order_id]);
            return result.rows[0];
        } catch (err) {
            throw new Error(`Cannot get order of id ${order_id}: ${err}`);
        } finally {
            conn.release();
        }
    }

    async create(order: Order): Promise<Order> {
        const conn = await client!.connect();
        try {
            const { order_status, user_id } = order;
            const sqlQuery =
                'INSERT INTO orders (order_status, user_id) VALUES ($1, $2) RETURNING *';
            const result = await conn.query(sqlQuery, [order_status, user_id]);
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not create new order: ${err}`);
        } finally {
            conn.release();
        }
    }

    async update(order: Order): Promise<Order> {
        const conn = await client!.connect();
        try {
            const { order_id, order_status, user_id } = order;
            const sqlQuery =
                'UPDATE orders SET order_status = $1, user_id = $2 WHERE order_id = $3 RETURNING *';
            const result = await conn.query(sqlQuery, [
                order_status,
                user_id,
                order_id
            ]);
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not update order status: ${err}`);
        } finally {
            conn.release();
        }
    }

    async delete(order_id: number): Promise<Order> {
        const conn = await client!.connect();
        try {
            const sqlQuery =
                'DELETE FROM orders WHERE order_id = $1 RETURNING *';
            const result = await conn.query(sqlQuery, [order_id]);
            return result.rows[0];
        } catch (err) {
            throw new Error(`Failed to delete order of id ${order_id}: ${err}`);
        } finally {
            conn.release();
        }
    }
}
