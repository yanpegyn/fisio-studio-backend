const { Op, ValidationError } = require("sequelize");
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
        //delete data.senha;
        return res.status(201).send(data).end();
    } catch (err) {
        if (err instanceof ValidationError) return res.status(400).send(err.errors[0].message).end();
        console.error(err);
        return res.status(500).send({ message: 'Erro interno' }).end();
    }
}

module.exports.read = async (req, res) => {
    try {
        const { page, pageSize, id } = req.query;
        const offset = parseInt(page) * parseInt(pageSize);
        const limit = parseInt(pageSize);
        const clientes = await (async (id) => {
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
        //delete data.senha;
        return res.status(201).send(data).end();
    } catch (err) {
        if (err instanceof ValidationError) return res.status(400).send(err.errors[0].message).end();
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

module.exports.aniversariantes = async (req, res) => {
    const convertDate = (date) => date.split("T")[0].split("-").filter((_v, i) => i > 0);
    const isNumeric = (input) => (input - 0) == input && ("" + input).length > 0;
    try {
        const { page, pageSize, mes, dia, dia_fim } = req.query;
        const offset = parseInt(page) * parseInt(pageSize);
        const limit = parseInt(pageSize);
        const clientes = await (async () => {
            try {
                let hj = null;
                if (isNumeric(mes) && isNumeric(dia) && (1 <= mes && mes <= 12) && (1 <= dia && dia <= 31)) {
                    hj = [mes, dia];
                } else hj = convertDate(new Date().toISOString());
                if (dia_fim && isNumeric(dia_fim) && (1 <= dia_fim && dia_fim <= 31)) {
                    hj[2] = dia_fim;
                } else hj[2] = hj[1];
                return await Cliente.findAndCountAll({
                    where: {
                        [Op.and]: [
                            sequelize.where(sequelize.fn('month', sequelize.col('data_de_nascimento')), hj[0]),
                            sequelize.where(sequelize.fn('day', sequelize.col('data_de_nascimento')), { [Op.between]: [hj[1], hj[2]] })
                        ]
                    },
                    offset,
                    limit
                });
            } catch (err) {
                console.error(err);
                return [];
            }
        })();
        return res.status(200).send(clientes).end();
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Erro interno' }).end();
    }
}