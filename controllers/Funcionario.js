const { Funcionario } = global.sequelize.models;

module.exports.create = async (req, res) => {
    try {
        const funcionario = await Funcionario.build(
            {
                nome_de_usuario: req.body.nome_de_usuario,
                senha: req.body.senha,
                endereco: req.body.endereco,
                data_de_nascimento: req.body.data_de_nascimento,
                inicio_na_empresa: req.body.inicio_na_empresa,
                telefone: req.body.telefone,
                CPF: req.body.CPF,
                profissao: req.body.profissao,
                privilegio: req.body.privilegio
            }
        );
        await funcionario.save();
        const data = { ...funcionario.dataValues };
        delete data.senha;
        return res.status(201).send(data).end();
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Erro interno' }).end();
    }
}

module.exports.read = async (req, res) => {
    try {
        const { page, pageSize } = req.query;
        const offset = page * pageSize;
        const limit = pageSize;
        const funcionarios = await Funcionario.findAndCountAll({ attributes: { exclude: ['senha'] }, offset, limit });
        return res.status(200).send({ funcionarios }).end();
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Erro interno' }).end();
    }
}

module.exports.update = async (req, res) => {
    try {
        const funcionario = await Funcionario.findOne(
            {
                where: { id: req.body.id }
            }
        );
        if(req.body.nome_de_usuario) funcionario.nome_de_usuario = req.body.nome_de_usuario;
        if(req.body.senha) funcionario.senha = req.body.senha;
        if(req.body.endereco) funcionario.endereco = req.body.endereco;
        if(req.body.data_de_nascimento) funcionario.data_de_nascimento = req.body.data_de_nascimento;
        if(req.body.inicio_na_empresa) funcionario.inicio_na_empresa = req.body.inicio_na_empresa;
        if(req.body.telefone) funcionario.telefone = req.body.telefone;
        if(req.body.CPF) funcionario.CPF = req.body.CPF;
        if(req.body.profissao) funcionario.profissao = req.body.profissao;
        if(req.body.privilegio) funcionario.privilegio = req.body.privilegio;
        await funcionario.save();
        const data = { ...funcionario.dataValues };
        delete data.senha;
        return res.status(201).send(data).end();
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Erro interno' }).end();
    }
}

module.exports.delete = async (req, res) => {
    try {
        const funcionario = await Funcionario.findOne(
            {
                where: { id: req.body.id }
            }
        );
        funcionario.destroy();
        return res.status(200).send({ message: 'Deletado' }).end();
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Erro interno' }).end();
    }
}