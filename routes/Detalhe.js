const detalhe = require('../controllers/Detalhe');
module.exports = (() => {
    const router = require('express').Router();
    router.post('/', detalhe.create);
    router.get('/', detalhe.read);
    router.update('/', detalhe.update);
    router.delete('/', detalhe.delete);
    return router;
})();