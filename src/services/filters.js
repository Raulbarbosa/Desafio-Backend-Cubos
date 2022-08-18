// const yup = require('yup');
// const { response } = require('../routes');

const checkPassword = (password) => {
    const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*+=_&!@#\-])[0-9a-zA-Z$*&!=_\-@#+]{8,}$/;
    const response = regexPassword.test(password);

    return response;
}

console.log(checkPassword('!Abcd3fg'))

// const createUserSchema = yup.object().shape({
//     name: yup.string().required(),
//     email: yup.string().email().required(),
//     senha: yup.string.required()
// })