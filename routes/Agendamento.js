const agendamento = require('../controllers/Agendamento');
module.exports = (app) => {
    const router = app.Router();
    router.post('/', agendamento.create)
        .get('/', agendamento.read)
        .update('/', agendamento.update)
        .delete('/', agendamento.delete)
        .use('/agendamento', require('./Detalhe')(app));
    return router;
}