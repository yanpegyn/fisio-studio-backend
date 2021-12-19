module.exports = (req, res, next) => {
    const { nome_de_usuario, senha } = req.body;
    const where = { nome_de_usuario };
    const adm = await global.sequelize.models.Funcionario.findOne({ where });
    let valid = (adm && (await adm.efetuaLogin(senha))) ? true : false;
    if(!valid) return res.status(401).send({ message: 'Usuário ou senha incorreto' }).end();
    res.locals.user = adm.user;
    next();
};
///Definir os privilégios