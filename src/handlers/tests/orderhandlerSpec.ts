import request from 'supertest';
import client from '../../database';
import { OrdersModel } from '../../models/order';
import { verifyUser } from '../../middleware/JWTs';
import app from '../../server';

const orderModel: OrdersModel = new OrdersModel();

describe('Orders API', () => {
    let orderId: number;

    beforeAll(async () => {
        // create a new order for testing
        const order = {
            user_id: 1,
            order_status: 'pending'
        };
        const newOrder = await orderModel.create(order);
        orderId = newOrder.user_id;
    });

    describe('PUT /order/:id', () => {
        it('should return 400 if order_id, order_status, and user_id are not provided', async () => {
            const response = await request(app)
                .put(`/order/${orderId}`)
                .send({});
            expect(response.status).toBe(400);
        });

        it('should return 401 if user is not authorized to update the order', async () => {
            const response = await request(app).put(`/order/${orderId}`).send({
                order_id: orderId,
                order_status: 'shipped',
                user_id: 2
            });
            expect(response.status).toBe(401);
        });

        it('should update the order status', async () => {
            const response = await request(app).put(`/order/${orderId}`).send({
                order_id: orderId,
                order_status: 'shipped',
                user_id: 1
            });
            expect(response.status).toBe(200);
            expect(response.body.data.order_status).toBe('shipped');
        });
    });

    describe('DELETE /order/:id', () => {
        it('should return 400 if order_id is not valid', async () => {
            const response = await request(app).delete('/order/abc');
            expect(response.status).toBe(400);
        });

        it('should return 401 if user is not authorized to delete the order', async () => {
            const response = await request(app)
                .delete(`/order/${orderId}`)
                .send({
                    user_id: 2
                });
            expect(response.status).toBe(401);
        });
    });

    afterAll(async () => {
        await orderModel.delete(orderId);

        const conn = await client.connect();
        const sql = `ALTER SEQUENCE users_id_seq RESTART WITH 1; ALTER SEQUENCE product_id_seq RESTART WITH 1;ALTER SEQUENCE orders_id_seq RESTART WITH 1;`;
        await conn.query(sql);
        conn.release();
    });
});
