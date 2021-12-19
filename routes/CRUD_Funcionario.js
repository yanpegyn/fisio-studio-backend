const funcionario = require('../controllers/Funcionario');
module.exports = (app) => {
    const router = app.Router();
    router.use(require('../middlewares/Login'))
        .post('/', funcionario.create)
        .get('/', funcionario.read)
        .update('/', funcionario.update)
        .delete('/', funcionario.delete);
    return router;
}