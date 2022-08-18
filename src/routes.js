const express = require('express');
const { createUser } = require('./controllers/users');

const routes = express();

routes.post('/users', createUser);

module.exports = routes;