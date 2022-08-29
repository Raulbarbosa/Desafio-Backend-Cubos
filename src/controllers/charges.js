const knex = require('../connection');
const { createChargeSchema } = require('../services/filters');

const createCharge = async (req, res) => {
    const { cliente, descricao, valor, vencimento, status } = req.body;

    try {
        await createChargeSchema.validate(req.body);
        const createdCharge = await knex("charges").insert({
            customer_id: cliente,
            descricao,
            valor,
            vencimento,
            status
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
    const { id } = req.params;
    const { cliente, descricao, valor, vencimento, status } = req.body;

    try {
        await createChargeSchema.validate(req.body);
        const chargeFound = await knex('charges').where({ id }).first();
        await createChargeSchema.validate(req.body);

        if (!chargeFound) {
            return res.status(404).json('Cobrança não encontrada');
        }

        const charge = await knex('charges')
            .where({ id })
            .update({
                customer_id: cliente,
                descricao,
                valor,
                vencimento,
                status
            });

        if (!charge) {
            return res.status(400).json("A cobrança não foi atualizada");
        }

        return res.status(200).json('Cobrança foi atualizada com sucesso.');
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

const getCharge = async (req, res) => {
    const { id: chargeId } = req.params;

    try {
        const charge = await knex('charges').join('customers', 'charges.customer_id', 'customers.id')
            .select('charges.*', 'customers.nome').where("charges.id", chargeId);

        if (!charge) {
            return res.status(404).json('Cobrança não encontrada');
        }

        return res.status(200).json(charge);
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

const getAllCharges = async (req, res) => {

    try {
        const charges = await knex('charges').join('customers', 'charges.customer_id', 'customers.id')
            .select('charges.*', 'customers.nome');
        return res.status(200).json(charges);

    } catch (error) {
        return res.status(500).json(error.message);
    }
}

const deleteCharge = async (req, res) => {
    const { id } = req.params;

    try {
        const chargeFound = await knex('charges').where({ id }).first();

        if (!chargeFound) {
            return res.status(404).json('Cobrança não encontrada');
        }

        const chargeDeleted = await knex('charges').where({ id }).del();

        if (!chargeDeleted) {
            return res.status(400).json("A cobrança não foi excluida");
        }

        return res.status(200).json('Cobrança excluida com sucesso');
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

module.exports = {
    createCharge,
    updateCharge,
    getCharge,
    getAllCharges,
    deleteCharge
}