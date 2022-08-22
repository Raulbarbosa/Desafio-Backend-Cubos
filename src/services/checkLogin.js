const jwt = require('jsonwebtoken');
const knex = require('../connection');

const checkLogin = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json('Não autorizado');
    }

    try {
        const token = authorization.replace('Bearer ', '').trim();

        const { id } = jwt.verify(token, process.env.PRIVATEKEY);

        const userExist = await knex('users').where({ id }).first();

        if (!userExist) {
            return res.status(404).json('Usuario não encontrado');
        }

        const { senha, ...user } = userExist;

        req.user = user;

        next();
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

module.exports = checkLogin;