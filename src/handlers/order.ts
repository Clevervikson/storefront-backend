import express from 'express';
import { OrdersModel } from '../models/order';
import { Request, Response } from 'express';
import { verifyUser } from '../middleware/JWTs';

const orderModel = new OrdersModel();

export const index = async (_req: Request, res: Response) => {
    const isAuthenticated = verifyUser(_req);
    if (!isAuthenticated) {
        return res.status(401).json({
            status: 'error',
            message: 'Authentication failed. Please provide valid credentials.'
        });
    }

    try {
        const orders = await orderModel.index();
        res.status(200).json({
            status: 'success',
            data: orders,
            message: 'Orders list retrieved successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Unable to retrieve orders list. Please try again later.'
        });
    }
};

const show = async (_req: Request, res: Response) => {
    const orderId = parseInt(_req.params.order_id);

    if (isNaN(orderId) || orderId < 0) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid order ID. Please provide a valid ID.'
        });
    }

    const isAuthorized = verifyUser(_req, orderId);

    if (!isAuthorized) {
        return res.status(401).json({
            status: 'error',
            message:
                'You are not authorized to view this order. Please login with valid credentials.'
        });
    }

    try {
        const currentOrder = await orderModel.show(orderId);

        if (!currentOrder) {
            return res.status(404).json({
                status: 'error',
                message: 'Order not found. Please provide a valid order ID.'
            });
        }

        res.status(200).json({
            status: 'success',
            data: currentOrder,
            message: 'Order retrieved successfully.'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'An unexpected error occurred. Please try again later.'
        });
    }
};

const create = async (req: Request, res: Response) => {
    try {
        const { order_status, user_id } = req.body;

        if (!order_status || !user_id) {
            return res.status(400).json({
                status: 'error',
                message: 'Both order status and user ID are required'
            });
        }

        const authorized = verifyUser(req, user_id);

        if (!authorized) {
            return res.status(401).json({
                status: 'error',
                message: 'User not authorized'
            });
        }

        const newOrder = await orderModel.create({ order_status, user_id });
        res.status(201).json({
            status: 'success',
            data: newOrder,
            message: 'Order created successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
};

const update = async (req: Request, res: Response) => {
    try {
        const { order_id, order_status, user_id } = req.body;

        if (!order_id || !order_status || !user_id) {
            return res.status(400).json({
                status: 'error',
                message: 'Order ID, order status, and user ID are required'
            });
        }

        const authorized = verifyUser(req, user_id);

        if (!authorized) {
            return res.status(401).json({
                status: 'error',
                message: 'User not authorized'
            });
        }

        const updatedOrder = await orderModel.update({
            order_id,
            order_status,
            user_id
        });
        res.status(200).json({
            status: 'success',
            data: updatedOrder,
            message: 'Order updated successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
};

const deleteOrder = async (req: Request, res: Response) => {
    const orderId = parseInt(req.params.order_id);

    if (isNaN(orderId) || orderId < 0) {
        return res.status(400).json({
            status: 'failure',
            message: 'Invalid order ID'
        });
    }

    const authorized = verifyUser(req, orderId);
    if (!authorized) {
        return res.status(401).json({
            status: 'failure',
            message: 'User not authorized'
        });
    }

    try {
        const deletedOrder = await orderModel.delete(orderId);
        return res.status(200).json({
            status: 'success',
            message: 'Order deleted successfully',
            data: deletedOrder
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
};

const ordersRouter = (app: express.Application) => {
    app.get('/orders', index);
    app.get('/order/:id', show);
    app.post('/order/new', create);
    app.put('/order/:id', update);
    app.delete('/order/:id', deleteOrder);
};

export default ordersRouter;
