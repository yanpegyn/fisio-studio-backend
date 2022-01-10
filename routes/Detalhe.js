const detalhe = require('../controllers/Detalhe');
module.exports = (() => {
    const router = require('express').Router();
    router.post('/', detalhe.create)
        .get('/', detalhe.read)
        .put('/', detalhe.update)
        .delete('/', detalhe.delete);
    return router;
})();