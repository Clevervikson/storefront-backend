import express, { Request, Response } from 'express';
import { ProductModel } from '../models/product';
import { verifyUser } from '../middleware/JWTs';

const productModel = new ProductModel();

const index = async (req: Request, res: Response) => {
    try {
        const authorized = verifyUser(req);
        if (!authorized) {
            return res.status(401).json({
                status: 'error',
                message: 'User not authorized'
            });
        }

        const products = await productModel.index();
        return res.status(200).json({
            status: 'success',
            message: 'Products list retrieved successfully',
            data: products
        });
    } catch (error) {
        console.error(
            `Error in fetching products: ${(error as Error).message}`
        );
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
};

const show = async (req: Request, res: Response) => {
    try {
        const productId = parseInt(req.params.id);
        if (isNaN(productId) || productId < 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid product ID.'
            });
        }

        const isAuthorized = await verifyUser(req, productId);
        if (!isAuthorized) {
            return res.status(401).json({
                status: 'error',
                message: 'User is not authorized to access this resource.'
            });
        }

        const product = await productModel.show(productId);
        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: product,
            message: 'Product retrieved successfully'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while fetching the product'
        });
    }
};

const create = async (req: Request, res: Response) => {
    try {
        const { name, price, category } = req.body;
        if (!name || !price || !category) {
            return res.status(400).json({
                status: 'error',
                message: 'Product name, price, and category are required.'
            });
        }

        const isAuthorized = await verifyUser(req);
        if (!isAuthorized) {
            return res.status(401).json({
                status: 'error',
                message: 'User is not authorized to access this resource.'
            });
        }

        const newProduct = await productModel.create({ name, price, category });
        res.status(201).json({
            status: 'success',
            data: newProduct,
            message: 'Product created successfully.'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong while creating the product.'
        });
    }
};

const update = async (req: Request, res: Response) => {
    try {
        const { id, name, price, category } = req.body;
        if (id == null || name == null || price == null || category == null) {
            return res.status(400).json({
                status: 'error',
                message: 'Product ID, name, price, and category are required.'
            });
        }
        const isAuthorized = await verifyUser(req);
        if (!isAuthorized) {
            return res.status(401).json({
                status: 'error',
                message: 'User is not authorized to access this resource.'
            });
        }
        const updatedProduct = await productModel.update(id, price);
        res.status(200).json({
            status: 'success',
            data: updatedProduct,
            message: 'Product updated successfully.'
        });
    } catch (error) {
        const message = (error as Error).message;
        res.status(500).json({
            status: 'error',
            message: `Failed to update product: ${message}`
        });
    }
};

const deleteProduct = async (req: Request, res: Response) => {
    try {
        const productId = parseInt(req.params.id);
        if (isNaN(productId)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid product ID.'
            });
        }
        const isAuthorized = await verifyUser(req);
        if (!isAuthorized) {
            return res.status(401).json({
                status: 'error',
                message: 'User is not authorized to access this resource.'
            });
        }
        const deletedProduct = await productModel.delete(productId);
        res.status(200).json({
            status: 'success',
            data: deletedProduct,
            message: 'Product deleted successfully.'
        });
    } catch (error) {
        const message = (error as Error).message;
        res.status(500).json({
            status: 'error',
            message: `Failed to delete product: ${message}`
        });
    }
};

const productRouter = (app: express.Application) => {
    app.get('/products', index);
    app.get('/product/:id', show);
    app.post('/product/new', create);
    app.put('/products', update);
    app.delete('/products', deleteProduct);
};

export default productRouter;
