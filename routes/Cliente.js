const cliente = require('../controllers/Cliente');
module.exports = (() => {
    const router = require('express').Router();
    router.use(require('../middlewares/Login'))
        .post('/', cliente.create)
        .get('/', cliente.read)
        .put('/', cliente.update)
        .delete('/', cliente.delete)
        .get('/aniversariantes', cliente.aniversariantes)
        .use('/agendamento', require('./Agendamento'))
        .use('/credito', require('./Credito'));
    return router;
})();

