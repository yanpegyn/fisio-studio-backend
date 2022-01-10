const funcionario = require('../controllers/Funcionario');
module.exports = (() => {
    const router = require('express').Router();
    router.use(require('../middlewares/Login'))
        .post('/', funcionario.create)
        .get('/', funcionario.read)
        .update('/', funcionario.update)
        .delete('/', funcionario.delete);
    return router;
})();