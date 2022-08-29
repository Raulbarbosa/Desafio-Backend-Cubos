const yup = require('./yupConfig');

const createUserSchema = yup.object().shape({
    nome: yup.string().required("O nome é obrigatório."),
    email: yup.string().email().required("O e-mail é obrigatório."),
    senha: yup.string().required()
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*+=_&!@#\-])[0-9a-zA-Z$*&!=_\-@#+]{8,}$/,
            'A senha não atende aos requisitos mínimos')
})

const updateUserSchema = yup.object().shape({
    nome: yup.string().required(),
    email: yup.string().email().required(),
    senha: yup.string().matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*+=_&!@#\-])[0-9a-zA-Z$*&!=_\-@#+]{8,}$/,
        'A senha não atende aos requisitos mínimos'),
    cpf: yup.string().min(11, 'Cpf Inválido').max(11, 'Cpf Inválido')
})

const createCustomersSchema = yup.object().shape({
    nome: yup.string().required({ errorId: 'nome', message: 'O nome é obrigatório.' }),
    email: yup.string().email().required({ errorId: 'email', message: 'O e-mail é obrigatório' }),
    cpf: yup.string().min(11, { errorId: 'cpf', message: 'CPF inválido' }).max(11, { errorId: 'cpf', menssage: 'CPF inválido' }),
    cep: yup.string().min(8, { errorId: 'cep', message: 'CEP inválido' }).max(8, { errorId: 'cep', message: 'CEP inválido' })
})

const createChargeSchema = yup.object().shape({
    cliente: yup.number().required(),
    descricao: yup.string().required({ errorId: 'descricao', message: 'A descrição é obrigatória' }),
    valor: yup.number().required({ errorId: 'valor', message: 'O valor é obrigatório' }),
    vencimento: yup.string().required({ errorId: 'vencimento', message: 'O vencimento é obrigatório' })
})

module.exports = {
    createUserSchema,
    createCustomersSchema,
    updateUserSchema,
    createChargeSchema
}