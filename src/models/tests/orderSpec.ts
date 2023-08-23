import { Order } from '../../models/order';
import { User } from '../../models/user';
import { OrdersModel } from '../../models/order';
import { UserModel } from '../../models/user';

describe('OrdersModel', () => {
    const userModel = new UserModel();
    const ordersModel = new OrdersModel();

    const testOrder: Order = {
        order_status: 'active',
        user_id: NaN
    };
    let expectedUser: User;

    beforeAll(async () => {
        expectedUser = await userModel.create({
            first_name: 'zik',
            last_name: 'vim',
            password: 'obi2023'
        });
        testOrder.user_id = expectedUser.user_id as number;
    });

    it('has the expected methods', () => {
        expect(ordersModel.index).toBeDefined();
        expect(ordersModel.show).toBeDefined();
        expect(ordersModel.create).toBeDefined();
        expect(ordersModel.update).toBeDefined();
        expect(ordersModel.delete).toBeDefined();
    });

    it('creates a new order', async () => {
        const createdOrder = await ordersModel.create(testOrder);
        expect(createdOrder.order_status).toEqual(testOrder.order_status);
        expect(createdOrder.user_id).toEqual(testOrder.user_id);
    });

    it('updates an existing order', async () => {
        const existingOrder = await ordersModel.create(testOrder);
        const updatedOrder = await ordersModel.update({
            order_id: existingOrder.order_id as number,
            order_status: 'inactive',
            user_id: existingOrder.user_id as number
        });
        expect(updatedOrder.order_status).toEqual('inactive');
    });

    it('deletes an existing order', async () => {
        const existingOrder = await ordersModel.create(testOrder);
        const deletedOrder = await ordersModel.delete(
            existingOrder.order_id as number
        );
        expect(deletedOrder.user_id).toEqual(existingOrder.user_id);
    });
});
