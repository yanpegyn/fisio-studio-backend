module.exports = async (req, res, next) => {
    //console.log(JSON.stringify(req.headers));
    try {
        let nome_de_usuario = null;
        let senha = null;
        if (req.body.credenciais) {
            nome_de_usuario = req.body.credenciais["nome_de_usuario"];
            senha = req.body.credenciais["senha"];
        } else {
            let credenciais = JSON.encode(req.header("credenciais"));
            console.log(credenciais);
            nome_de_usuario = credenciais["nome_de_usuario"];
            senha = credenciais["senha"];
            console.log(nome_de_usuario);
            console.log(senha);
        }
        const where = { nome_de_usuario };
        const adm = await global.sequelize.models.Funcionario.findOne({ where });
        let valid = (adm && (await adm.efetuaLogin(senha))) ? true : false;
        if (!valid) return res.status(401).send({ message: 'Usuário ou senha incorreto' }).end();
        res.locals.user = adm.user;
        next();
    } catch (err) {
        console.log(err);
        return res.status(403).end();
    }
};
///Definir os privilégios