const { Op } = require("sequelize");
const { Cliente } = global.sequelize.models;

module.exports.create = async (req, res) => {
    try {
        const cliente = await Cliente.build(
            {
                nome: req.body.nome,
                endereco: req.body.endereco,
                data_de_nascimento: req.body.data_de_nascimento,
                telefone: req.body.telefone,
                CPF: req.body.CPF
            }
        );
        await cliente.save();
        const data = { ...cliente.dataValues };
        delete data.senha;
        return res.status(201).send(data).end();
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Erro interno' }).end();
    }
}

module.exports.read = async (req, res) => {
    try {
        const { page, pageSize, id } = req.query;
        const offset = page * pageSize;
        const limit = pageSize;
        const clientes = ((id) => {
            try {
                if (id) {
                    return await Cliente.findOne({
                        where: { "id": { [Op.eq]: id } }
                    });
                }
            } catch (err) {
                console.error(err);
                return {};
            }
            try {
                return await Cliente.findAndCountAll({ offset, limit });
            } catch (err) {
                console.error(err);
                return [];
            }
        })(id);
        return res.status(200).send(clientes).end();
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Erro interno' }).end();
    }
}

module.exports.update = async (req, res) => {
    try {
        const cliente = await Cliente.findOne(
            {
                where: { "id": { [Op.eq]: req.body.id } }
            }
        );
        if (req.body.nome) cliente.nome = req.body.nome;
        if (req.body.endereco) cliente.endereco = req.body.endereco;
        if (req.body.data_de_nascimento) cliente.data_de_nascimento = req.body.data_de_nascimento;
        if (req.body.telefone) cliente.telefone = req.body.telefone;
        if (req.body.CPF) cliente.CPF = req.body.CPF;
        await cliente.save();
        const data = { ...cliente.dataValues };
        delete data.senha;
        return res.status(201).send(data).end();
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Erro interno' }).end();
    }
}

module.exports.delete = async (req, res) => {
    try {
        const cliente = await Cliente.findOne(
            {
                where: { "id": { [Op.eq]: req.body.id } }
            }
        );
        cliente.destroy();
        return res.status(200).send({ message: 'Deletado' }).end();
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Erro interno' }).end();
    }
}