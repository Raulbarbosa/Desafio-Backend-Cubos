const knex = require('../connection');
const { createCustomersSchema } = require('../../src/services/filters');

const createCustomers = async (req, res) => {
    const { nome, email, telefone, cpf, cep, logradouro, complemento, bairro, cidade, estado } = req.body;
    try {
        await createCustomersSchema.validate(req.body);
        const emailAlreadyExists = await knex('customers').where({ email }).first();
        const cpfAlreadyExists = await knex('customers').where({ cpf }).first();

        if (emailAlreadyExists) {
            return res.status(400).json({ errorId: "email", message: "e-mail já cadastrado" });
        }

        if (cpfAlreadyExists) {
            return res.status(400).json({ "message": "cpf já cadastrado" });
        }

        const customer = await knex('customers').insert({
            nome,
            email,
            telefone,
            cpf,
            cep,
            logradouro,
            complemento,
            bairro,
            cidade,
            estado
        }).returning('*');

        if (!customer) {
            return res.status(400).json('O cliente não foi cadastrado');
        }

        return res.status(201).json(customer);
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

const getCustomerDetail = async (req, res) => {
    const { id } = req.params;

    try {
        const customer = await knex('customers').where({ id });

        if (!customer) {
            return res.status(404).json("Cliente não encontrado")
        }

        const chargesCustomer = await knex('charges').join('customers', 'charges.customer_id', 'customers.id')
            .select('charges.*').where('customer_id', id);

        for (let charge of chargesCustomer) {
            if (charge.vencimento < new Date() && charge.status === "pendente") {
                charge.status = "vencida";
            }
        }

        return res.status(200).json({ customer, chargesCustomer });

    } catch (error) {
        return res.status(500).json(error.message)
    }
}

const getAllCustomers = async (req, res) => {

    try {
        const customers = await knex('customers');

        for (let customer of customers) {
            const overdueChargesFound = await knex('charges').where('charges.customer_id', customer.id).where('charges.status', 'pendente')
                .where('charges.vencimento', '<', 'NOW()', '-', '1 day').first();

            if (overdueChargesFound) {
                customer.status = "Inadimplente"
            } else {
                customer.status = "Em dia"
            }
        }

        return res.status(200).json(customers);

    } catch (error) {
        return res.status(500).json(error.message);
    }
}

const updateCustomer = async (req, res) => {
    const { id } = req.params;
    const { nome, email, telefone, cpf, cep, logradouro, complemento, bairro, cidade, estado } = req.body;

    try {
        const customerFound = await knex('customers').where({ id }).first();
        await createCustomersSchema.validate(req.body);

        if (!customerFound) {
            return res.status(404).json('Cliente não encontrado');
        }

        if (email !== customerFound.email) {
            const emailAlreadyExists = await knex('customers').where({ email }).first();
            if (emailAlreadyExists) {
                return res.status(400).json({ "message": "e-mail já cadastrado" });
            }
        }

        if (cpf !== customerFound.cpf) {
            const cpfAlreadyExists = await knex('customers').where({ cpf }).first();
            if (cpfAlreadyExists) {
                return res.status(400).json({ "message": "cpf já cadastrado" });
            }
        }

        const customer = await knex('customers')
            .where({ id })
            .update({
                nome,
                email,
                telefone,
                cpf,
                cep,
                logradouro,
                complemento,
                bairro,
                cidade,
                estado
            });

        if (!customer) {
            return res.status(400).json("O cliente não foi atualizado");
        }

        return res.status(200).json('cliente foi atualizado com sucesso.');
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

const deleteCustomer = async (req, res) => {
    const { id } = req.params;

    try {
        const customerExist = await knex('customers').where({ id }).first();

        if (!customerExist) {
            return res.status(404).json('Cliente não encontrado');
        }

        const customerDeleted = await knex('customers').where({ id }).del();

        if (!customerDeleted) {
            return res.status(400).json("O cliente não foi excluido");
        }

        return res.status(200).json('Cliente excluido com sucesso');
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

module.exports = {
    createCustomers,
    getAllCustomers,
    updateCustomer,
    deleteCustomer,
    getCustomerDetail
}