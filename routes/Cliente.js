const cliente = require('../controllers/Cliente');
module.exports = (() => {
    const router = require('express').Router();
    router.use(require('../middlewares/Login'));
    router.post('/', cliente.create);
    router.get('/', cliente.read);
    router.update('/', cliente.update);
    router.delete('/', cliente.delete);
    router.get('/aniversariantes', cliente.aniversariantes);
    router.use('/agendamento', require('./Agendamento'));
    return router;
})();

