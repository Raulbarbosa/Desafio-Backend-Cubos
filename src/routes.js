const express = require('express');
const { createUser } = require('./controllers/users');
const { login } = require('./controllers/login');

const routes = express();

routes.post('/users', createUser);
routes.post('/login', login);

module.exports = routes;