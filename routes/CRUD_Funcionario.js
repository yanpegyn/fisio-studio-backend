const funcionario = require('../controllers/Funcionario');
module.exports = (() => {
    const router = require('express').Router();
    router.use(require('../middlewares/Login'))
    router.post('/', funcionario.create);
    router.get('/', funcionario.read);
    router.update('/', funcionario.update);
    router.delete('/', funcionario.delete);
    return router;
})();