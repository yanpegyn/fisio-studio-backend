const agendamento = require('../controllers/Agendamento');
module.exports = (() => {
    const router = require('express').Router();
    router.post('/', agendamento.create);
    router.get('/', agendamento.read);
    router.update('/', agendamento.update);
    router.delete('/', agendamento.delete);
    router.use('/detalhe', require('./Detalhe'));
    return router;
})();