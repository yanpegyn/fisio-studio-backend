const agendamento = require('../controllers/Agendamento');
module.exports = (() => {
    const router = require('express').Router();
    router.post('/', agendamento.create)
        .get('/', agendamento.read)
        .put('/', agendamento.update)
        .delete('/', agendamento.delete)
        .use('/detalhe', require('./Detalhe'));
    return router;
})();