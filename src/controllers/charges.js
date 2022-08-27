const knex = require('../connection');
const { createChargeSchema } = require('../services/filters');

const createCharge = async (req, res) => {
    const { cliente, descricao, valor, vencimento } = req.body;

    try {
        await createChargeSchema.validate(req.body);

        const createdCharge = await knex("charges").insert({
            customer_id: cliente,
            descricao,
            valor,
            vencimento
        }).returning('*');

        if (!createdCharge) {
            return res.status(400).json({ "message": "Não foi possível cadastrar a cobrança" })
        }

        return res.status(201).json({ "message": "Cobrança criada com sucesso." })

    } catch (error) {
        return res.status(500).json(error.message);
    }


}

const updateCharge = async (req, res) => {

}

const getCharge = async (req, res) => {

}

const getAllCharge = async (req, res) => {

}

const deleteCharge = async (req, res) => {

}

module.exports = {
    createCharge,
    updateCharge,
    getCharge,
    getAllCharge,
    deleteCharge
}