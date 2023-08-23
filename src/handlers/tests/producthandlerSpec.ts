import request from 'supertest';
import productRouter from '../../handlers/product';
import client from '../../database';
import { UserModel } from '../../models/user';
import { User } from '../../models/user';
import app from "../../server"

const userModel: UserModel = new UserModel();
let token = ''; 

describe('Test product API', () => {
    const userData: User = {
        first_name: 'Greg',
        last_name: 'Obi',
        password: 'test123',
    };
    beforeAll(async () => {
      const created = await userModel.create(userData);
      token = Object(created)['token'];
      Object(created)['user'];
    });

    it('should return a list of products', async () => {
        const response = await request(app).get('/products');
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('success');
        expect(Array.isArray(response.body.data)).toBe(true);
      });
    
    it('should return a product with the specified ID', async () => {
      const response = await request(app).get('/product/1');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.id).toBe(1);
    });

    it('should create a new product', async () => {
      const product = {
        name: 'Beans',
        price: 690,
        category: 'Food',
      };
      const response = await request(app).post('/product/new').send(product);
      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.name).toBe(product.name);
    });

    it('should return a 400 status code if required fields are missing', async () => {
      const product = {
        price: 690,
        category: 'Food',
      };
      const response = await request(app).post('/product/new').send(product);
      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Product name, price, and category are required.');
    });

    it('Updates a product successfully with a PATCH request and returns 200 OK', async () => {
        const response = await request(app)
          .patch('/products')
          .set('content-type', 'application/json')
          .set('Authorization', 'Bearer ' + token)
          .send({
            id: 1,
            name: 'rice',
            price: 950
          });
        expect(response.status).toBe(200);
        expect(response.body.name).toBe('rice');
        expect(response.body.id).toBe(1);
        expect(response.body.price).toBe(950);
      });

    afterAll(async () => {
        await userModel.delete(1);
    
        const conn = await client.connect();
        const sql = `ALTER SEQUENCE users_id_seq RESTART WITH 1; ALTER SEQUENCE product_id_seq RESTART WITH 1;`;
        await conn.query(sql);
        conn.release();
      });

    it('should successfully delete a product and return a 200 status code', async () => {
        const productId = 1;
        const response = await request(app)
          .delete(`/product/delete/${productId}`)
          .set('Authorization', `Bearer ${token}`)
          .send({ id: productId });
        
        expect(response.status).toEqual(200);
        expect(response.body.message).toEqual('product deleted');
      }); 

