const cliente = require('../controllers/Cliente');
module.exports = (app) => {
    const router = app.Router();
    router.use(require('../middlewares/Login'))
        .post('/', cliente.create)
        .get('/', cliente.read)
        .update('/', cliente.update)
        .delete('/', cliente.delete);
    return router;
}