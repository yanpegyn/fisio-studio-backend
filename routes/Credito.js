const credito = require('../controllers/Credito');
module.exports = (() => {
    const router = require('express').Router();
    router.post('/', credito.create)
        .get('/', credito.read)
        .put('/', credito.update)
        .delete('/', credito.delete)
        .get('/validos', credito.get.validos)
        .get('/vencidos', credito.get.vencidos);
    return router;
})();