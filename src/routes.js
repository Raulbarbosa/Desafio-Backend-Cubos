const express = require('express');
const { createUser } = require('./controllers/users');
const { login } = require('./controllers/login');
const checkLogin = require('./services/checkLogin');
const customers = require('./controllers/customers')

const routes = express();

routes.post('/users', createUser);
routes.post('/login', login);

routes.use(checkLogin);

routes.post('/customers', customers.createCustomers);
routes.get('/customers/:id', customers.getCustomer);
routes.get('/customers', customers.getAllCustomers);

routes.put('/customers/:id', customers.updateCustomer);
routes.delete('/customers/:id', customers.deleteCustomer);

module.exports = routes;