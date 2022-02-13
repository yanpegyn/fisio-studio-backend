const funcionario = require('../controllers/Funcionario');
module.exports = (() => {
    const router = require('express').Router();
    router.use(require('../middlewares/Login'))
        .post('/', funcionario.create)
        .get('/', funcionario.read)
        .put('/', funcionario.update)
        .delete('/', funcionario.delete)
        .get('/download', funcionario.download);
    return router;
})();