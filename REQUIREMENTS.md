# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index [token required] '/products' [GET]
- Show [token required] '/prdoucts/:id' [GET] 
- Create [token required] '/products' [POST]
- Update [token required] '/products' [PATCH] 
- Delete [token required] '/products/:id' [DELETE]

#### Users
- Index [token required] '/users' [GET]
- Show [token required] '/users/:id' [GET] 
- Create N[token required] '/users' [POST] 
- Delete [token required] '/users/:id' [DELETE]

#### Orders
- Current Order by user (args: user id)[token required] '/orders/:id' [GET]
- [OPTIONAL] Completed Orders by user (args: user id)[token required] '/orders/:id' [GET]
- Delete Order (args: order id)[token required] '/orders/delete/:id' [GET]

## Data Shapes
#### Product
-  id
- name
- price
- category

#### Schema
CREATE TABLE products (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(50) NOT NULL,
  price      INTEGER NOT NULL,
  category   VARCHAR(250) NOT NULL
);

#### User
- id
- first_name
- last_name
- password

#### Schema
CREATE TABLE users (
  user_id         SERIAL PRIMARY KEY,
  first_name      VARCHAR(50) NOT NULL,
  last_name       VARCHAR(60) NOT NULL,
  password        VARCHAR(250) NOT NULL
);

#### Orders
- id
- order_id
- quantity of each product in the order
- user_id
- order_status 
- prd_id

#### Schema
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    order_status VARCHAR(50),
    user_id INTEGER NOT NULL REFERENCES users (user_id)
);
