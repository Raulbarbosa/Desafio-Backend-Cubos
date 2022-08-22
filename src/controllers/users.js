const brcrypt = require('bcrypt');
const knex = require('../connection');
const { createUserSchema } = require('../../src/services/filters');


const createUser = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        await createUserSchema.validate(req.body);

        const userAlreadyExists = await knex('users').where({ email }).first();

        if (userAlreadyExists) {
            return res.status(400).json({ "message": "e-mail já cadastrado" });
        }

        const passwordEncrypted = await brcrypt.hash(senha, 10);

        const user = await knex('users').insert({
            nome,
            email,
            senha: passwordEncrypted
        }).returning(["id", "nome", "email"]);

        return res.status(201).json(user);

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    createUser
}