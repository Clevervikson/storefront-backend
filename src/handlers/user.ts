import express from 'express';
import { Request, Response } from 'express';
import { UserModel } from '../models/user';
import { verifyUser, signIn } from '../middleware/JWTs';

const userModel = new UserModel();

const index = async (req: Request, res: Response) => {
    try {
        const isAuthorized = await verifyUser(req);
        if (!isAuthorized) {
            return res.status(401).json({
                status: 'error',
                message: 'User is not authorized to access this resource.'
            });
        }

        const users = await userModel.index();
        res.status(200).json({
            status: 'success',
            data: users,
            message: 'Successfully fetched users list.'
        });
    } catch (error) {
        res.status(500).json({
            status: 'failure',
            message: 'An error occurred while fetching users list.'
        });
    }
};

const show = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.user_id);

        if (isNaN(userId)) {
            return res.status(400).send('Invalid user ID');
        }

        const isAuthorized = verifyUser(req, userId);

        if (!isAuthorized) {
            return res.status(401).json({
                status: 'error',
                message: 'User is not authorized to access this resource'
            });
        }

        const user = await userModel.show(userId);

        res.status(200).json({
            status: 'success',
            data: user,
            message: 'User retrieved successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while processing the request'
        });
    }
};

const create = async (_req: Request, res: Response) => {
    try {
        const { first_name, last_name, password } = _req.body;
        if (!first_name || !last_name || !password) {
            return res
                .status(400)
                .send('Check parameters. Please enter all required fields');
        }
        const Authorized = verifyUser(_req);
        if (!Authorized) {
            res.status(401).json({
                status: 'error',
                message: 'User must be authorized'
            });
        }
        const newUser = await userModel.create({
            first_name,
            last_name,
            password
        });
        res.send(newUser).status(200);
    } catch (error) {
        const e = error as Error;
        res.status(401).json({
            status: 'failure',
            message: e.message
        });
    }
};
const deleteUser = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.user_id);
        if (isNaN(userId)) {
            return res.status(400).send('Invalid user ID');
        }

        const authorized = verifyUser(req, userId);
        if (!authorized) {
            return res.status(401).json({
                status: 'error',
                message: 'User is not authorized to delete this resource'
            });
        }

        const deletedUser = await userModel.delete(userId);
        res.status(200).json({
            status: 'success',
            data: deletedUser,
            message: 'User deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while processing the request'
        });
    }
};

const authenticate = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            status: 'error',
            message: 'Please enter a valid username and password'
        });
    }

    try {
        const authenticatedUser = await userModel.authenticate(
            username,
            password
        );

        if (authenticatedUser === null) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid username or password'
            });
        }

        const token = signIn(authenticatedUser.user_id as number);

        return res.status(200).json({
            status: 'success',
            data: {
                user: authenticatedUser,
                token
            },
            message: `Successfully logged in as ${username}`
        });
    } catch (error) {
        const e = error as Error;
        return res.status(500).json({
            status: 'error',
            message: `An error occurred while processing the request: ${e.message}`
        });
    }
};

const userRouter = (app: express.Application) => {
    app.get('/users', index);
    app.get('/user/:id', show);
    app.post('/user/new', create);
    app.delete('/users', deleteUser);
    app.post('/user/login', authenticate);
};

export default userRouter;
