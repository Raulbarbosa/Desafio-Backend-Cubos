const brcrypt = require('bcrypt');
const knex = require('../connection');
const { createUserSchema, updateUserSchema } = require('../../src/services/filters');
const { json } = require('express');


const createUser = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        await createUserSchema.validate(req.body);

        const userAlreadyExists = await knex('users').where({ email }).first();

        if (userAlreadyExists) {
            return res.status(400).json({ "message": "E-mail já cadastrado" });
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

const updateUser = async (req, res) => {
    const { user } = req;
    const { nome, email, senha, cpf, telefone } = req.body;

    if (!user) {
        return res.status(400).json({ "message": "Token não encontrado." });
    }

    try {

        await updateUserSchema.validate(req.body);
        let cpfForDB = '';
        let telefoneForDB = '';

        const userFound = await knex("users").where({ id: user.id }).first();


        if (userFound.cpf !== cpf) {
            if (cpf !== undefined) {
                const cpfExists = await knex("users").where({ cpf }).first();
                if (cpfExists) {
                    return res.status(400).json({ "message": "o cpf infomado já está em uso." });
                }
            }
        }

        if (userFound.email !== email) {
            const emailExists = await knex("users").where({ email }).first();
            if (emailExists) {
                return res.status(400).json({ "message": "o e-mail infomado já está em uso." })
            }
        }

        cpfForDB = cpf || userFound.cpf;
        telefoneForDB = telefone || userFound.telefone;

        if (senha) {

            const encryptedPassword = await brcrypt.hash(senha, 10);
            const updatedUser = await knex("users").where({ id: user.id }).update({
                nome,
                email,
                senha: encryptedPassword,
                cpf: cpfForDB,
                telefone: telefoneForDB
            });

            if (updatedUser === 0) {
                return res.status(400).json({ "message": "Não foi possível atualizar o usuário." })
            }

            return res.status(200).json({ "message": "Usuário atualizado com sucesso." })

        } else {

            const updatedUser = await knex("users").where({ id: user.id }).update({
                nome,
                email,
                cpf: cpfForDB,
                telefone: telefoneForDB
            });

            if (updatedUser === 0) {
                return res.status(400).json({ "message": "Não foi possível atualizar o usuário." })
            }

            return res.status(200).json({ "message": "Usuário atualizado com sucesso." })

        }



    } catch (error) {
        return res.status(500).json(error.message)
    }
}

const getUser = async (req, res) => {
    const { user } = req;

    if (!user) {
        return res.status(404).json({
            "mensagem": "Para acessar este recurso um token de autenticação válido deve ser enviado."
        })
    }

    return res.status(200).json(user);

}

module.exports = {
    createUser,
    updateUser,
    getUser
}