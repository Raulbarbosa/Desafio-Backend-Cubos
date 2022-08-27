const express = require('express');
const users = require('./controllers/users');
const { login } = require('./controllers/login');
const checkLogin = require('./services/checkLogin');
const customers = require('./controllers/customers');
const charges = require('./controllers/charges');

const routes = express();

routes.post('/users', users.createUser);
routes.post('/login', login);

routes.use(checkLogin);

routes.put('/users/', users.updateUser);
routes.get('/users/', users.getUser)

routes.post('/customers', customers.createCustomers);
routes.get('/customers/:id', customers.getCustomer);
routes.get('/customers', customers.getAllCustomers);
routes.get('/customers/:id/charges', customers.getCustomerCharges);


routes.post('/charges', charges.createCharge);
routes.put('/charges/:id', charges.updateCharge);
routes.get('/charges/:id', charges.getCharge);
routes.get('/charges', charges.getAllCharges);
routes.delete('/charges/:id', charges.deleteCharge);

routes.put('/customers/:id', customers.updateCustomer);
routes.delete('/customers/:id', customers.deleteCustomer);

module.exports = routes;