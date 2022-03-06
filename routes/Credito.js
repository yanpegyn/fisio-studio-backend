const credito = require('../controllers/Credito');
module.exports = (() => {
    const router = require('express').Router();
    router.post('/', credito.create)
        .get('/', credito.read)
        .put('/', credito.update)
        .delete('/', credito.delete)
        .get('/validos', credito.getValidos)
        .get('/vencidos', credito.getVencidos);
    return router;
})();