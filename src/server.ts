import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import userRouter from './handlers/user';
import productRouter from './handlers/product';
import ordersRouter from './handlers/order';

const app: express.Application = express();
const address = '0.0.0.0:3000';

app.use(bodyParser.json());

app.use('/user', userRouter);
app.use('/product', productRouter);
app.use('/order', ordersRouter);

app.get('/', function (req: Request, res: Response) {
    res.send('Hello World!');
});

app.listen(3000, function () {
    console.log(`starting app on: ${address}`);
});

export default app;
