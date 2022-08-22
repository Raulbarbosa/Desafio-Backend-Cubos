const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const knex = require('../connection');

const login = async (req, res) => {
    const { email, senha } = req.body;
    if (!email || !senha) {
        return res.status(400).json({ "message": "Email e senha são obrigatórios." });
    }

    try {

        const user = await knex("users").where({ email }).first();

        if (!user) {
            return res.status(404).json({ "message": "Email ou senha inválido." })
        }

        const passwordVerified = await bcrypt.compare(senha, user.senha);

        if (!passwordVerified) {
            return res.status(404).json({ "message": "Email ou senha inválido." })
        }

        const { senha: _, ...userData } = user;

        const token = jwt.sign({
            id: user.id
        }, process.env.PRIVATEKEY, { expiresIn: '1d' });

        return res.status(200).json({
            user: userData,
            token
        });

    } catch (error) {
        return res.status(500).json(error.message);
    }
}

module.exports = {
    login
};