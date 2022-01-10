const agendamento = require('../controllers/Agendamento');
module.exports = (() => {
    const router = require('express').Router();
    router.post('/', agendamento.create)
        .get('/', agendamento.read)
        .update('/', agendamento.update)
        .delete('/', agendamento.delete)
        .use('/detalhe', require('./Detalhe'));
    return router;
})();