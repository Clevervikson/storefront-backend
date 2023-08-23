# Udacity StoreFront back-end project

This project is the backend of a fictional company storefront application. It ensures that users are able to browse an index for all products,  see the specifics of a single product, and add products to an order that they can view in a cart page. this happens to be the API that will be supporting the project 

## Installation

To install all packages run `npm install` or `yarn`

## Required Technologies
Your application must make use of the following libraries:
- Postgres for the database
- Node/Express for the application logic
- dotenv from npm for managing environment variables
- db-migrate from npm for migrations
- jsonwebtoken from npm for working with JWTs
- jasmine from npm for testing
- prettier 
- eslint
- ts-node
- tsc-watch

## Installation Instructions
npm install -g db-migrate -db-migrate 
npm install Express
npm install dotenv
npm jsonwebtoken
npm install jasmine
npm install prettier 
npm install eslint 

## Scripts
Run 
server - `npm run watch` or `yarn watch`
prettier - `npm run prettier` or `yarn prettier`
eslint -  `npm run lint` or `yarn lint`
typescript - `npm run build`
migeration-up `npm run migrate up` or `yarn migrate up`
test - `npm run test` or `yarn test`

## Setting Database

- `CREATE DATABASE postgres`
- `CREATE DATABASE postgres_test`

- Connect to the new database by running:
`\c postgres`
Grant all privileges on the new database to the user by running:
`GRANT ALL PRIVILEGES ON DATABASE postgres TO postgres;`
- Test that the database is working by running the command:
`\dt`
- If the database is working correctly, this command should output "No relations found."

## Environment variables
POSTGRES_HOST=127.0.0.1
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_TEST_DB=postgres_test
BCRYPT_PASSWORD=""     
SALT_ROUNDS="10"
SECRET_TOKEN=""                   
BCRYPT_PASSWORD=""     
SALT_ROUNDS="10" 
SECRET_TOKEN=""                   
ENV=test

- ## API Endpoints
#### Products
- Create product -> [token required] '/products' [POST] [Provide name and price in the request body]

- Index -> '/products' [GET]

- Show product -> '/prdoucts/:id' [GET] [Provide porduct id in the url parameter]

- Update product -> [token required] '/products' [PATCH] [Provide porduct id, name and price in the request body]

- Delete product -> [token required] '/products/:id' [DELETE] [Provide porduct id in the url parameter]

#### Users
- Create User -> [token required] '/users' [POST] [Provide firstName lastName and password in the request body]

- Index ->[token required] '/users' [GET]

- Show User ->[token required] '/users/:id' [GET] [Provide user id in the url parameter]

- Update User -> [token required] '/users' [PATCH] [Provide id, firstName, lastName and password in the request body]

- Delete User -> [token required] '/users/:id' [DELETE] [Provide user id in the url parameter]

#### Orders
- [token required]  '/orders/active/:id' [GET] [Provide user id in the url parameter]

- [token required] '/orders/complete/:id' [GET] [Provide user id in the url parameter]
