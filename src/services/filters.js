const yup = require('./yupConfig');

const createUserSchema = yup.object().shape({
    nome: yup.string().required("O nome é obrigatório."),
    email: yup.string().email().required("O e-mail é obrigatório."),
    senha: yup.string().required()
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*+=_&!@#\-])[0-9a-zA-Z$*&!=_\-@#+]{8,}$/, 'A senha não atende aos requisitos mínimos')
})

const updateUserSchema = yup.object().shape({
    nome: yup.string().required("O nome é obrigatório."),
    email: yup.string().email().required("O e-mail é obrigatório."),
    senha: yup.string().matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*+=_&!@#\-])[0-9a-zA-Z$*&!=_\-@#+]{8,}$/, 'A senha não atende aos requisitos mínimos'),
    cpf: yup.string().min(11, 'Cpf Inválido').max(11, 'Cpf Inválido')
})

const createCustomersSchema = yup.object().shape({
    nome: yup.string().required(),
    email: yup.string().email().required(),
    cpf: yup.string().required().min(11, 'CPF inválido').max(11, 'CPF inválido'),
    cep: yup.string().min(8, 'CEP inválido').max(8, 'CEP inválido')
})

module.exports = {
    createUserSchema,
    createCustomersSchema,
    updateUserSchema
}