const yup = require('./yupConfig');

const checkPassword = (password) => {
    const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*+=_&!@#\-])[0-9a-zA-Z$*&!=_\-@#+]{8,}$/;
    const response = regexPassword.test(password);

    return response;
}

const createUserSchema = yup.object().shape({
    nome: yup.string().required(),
    email: yup.string().email().required(),
    senha: yup.string().required()
})

module.exports = {
    createUserSchema,
    checkPassword
}