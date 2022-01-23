const agendamento = require('../controllers/Agendamento');
module.exports = (() => {
    const router = require('express').Router();
    router.post('/', agendamento.create)
        .get('/', agendamento.read)
        .put('/', agendamento.update)
        .delete('/', agendamento.delete)
        .get('/horarios', agendamento.horarios)
        .use('/detalhe', require('./Detalhe'));
    return router;
})();