import request from 'supertest';
import client from '../../database';
import { User } from '../../models/user';
import app from "../../server"
import userRouter from '../../handlers/user';

let token = ''; 

userRouter(app);

describe('User Handler Endpoint Testing', () => {
  it('should return a list of users when GET /users is called', async () => {
    const response = await request(app).get('/users').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data).toBeDefined();
  });

  it('should return a single user when GET /user/:id is called with a valid id', async () => {
    const response = await request(app).get('/user/1').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data).toBeDefined();
  });

  it('should return an error when GET /user/:id is called with an invalid id', async () => {
    const response = await request(app).get('/user/invalid').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(400);
    expect(response.text).toBe('check parameters. user id is required');
  });

  it('should create a new user when POST /user/new is called with valid data', async () => {
    const userData: User = {
      first_name: 'Peter',
      last_name: 'Obi',
      password: '123456',
    };
    const response = await request(app).post('/user/new').send(userData);
    token = response.body.token;
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  it('deletes a user via a DELETE request and returns a 200 OK response', async () => {
    const userData = 1;
    const response = await request(app)
      .delete(`/users/${userData}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
  
    expect(response.status).toBe(200);
    expect(response.body.message).toContain('User deleted successfully');
  });


  afterAll(async () => {
    try {
      const conn = await client.connect();
      const sql = `ALTER SEQUENCE users_id_seq RESTART WITH 1; ALTER SEQUENCE product_id_seq RESTART WITH 1;`;
      const alterID = 'ALTER SEQUENCE users_id_seq RESTART WITH 1';
      await conn.query(sql);
      await conn.query(alterID);
      conn.release();
    } catch (error) {
      console.error(`Error occurred while cleaning up database: ${error}`);
    }
  })})