const detalhe = require('../controllers/Detalhe');
module.exports = (app) => {
    const router = app.Router();
    router.post('/', detalhe.create)
        .get('/', detalhe.read)
        .update('/', detalhe.update)
        .delete('/', detalhe.delete);
    return router;
}