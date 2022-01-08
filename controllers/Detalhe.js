const { Op } = require("sequelize");
const { Detalhe } = global.sequelize.models;

module.exports.create = async (req, res) => {
    try {
        const detalhe = await Detalhe.build(
            {
                paciente: req.body.paciente,
                tipo: req.body.tipo,
                inicio: req.body.inicio,
                fim: req.body.fim,
                valor: req.body.valor
            }
        );
        await detalhe.save();
        const data = { ...detalhe.dataValues };
        //delete data.senha;
        return res.status(201).send(data).end();
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Erro interno' }).end();
    }
}

module.exports.read = async (req, res) => {
    try {
        const { id, agendamento } = req.query;
        const detalhe = ((id, agendamento) => {
            try {
                let where = null;
                if (id && agendamento) {
                    where = {
                        [Op.or]: [
                            { "id": { [Op.eq]: id } },
                            { "agendamento": { [Op.eq]: agendamento } }
                        ]
                    }
                } else if (id) {
                    where = { "id": { [Op.eq]: id } }
                } else if (agendamento) {
                    where = { "agendamento": { [Op.eq]: agendamento } }
                } else return {};
                return await Detalhe.findOne({ where: where });
            } catch (err) {
                console.error(err);
                return {};
            }
        })(id, agendamento);
        return res.status(200).send(detalhe).end();
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Erro interno' }).end();
    }
}

module.exports.update = async (req, res) => {
    try {
        const detalhe = await Detalhe.findOne(
            {
                where: { "id": { [Op.eq]: req.body.id } }
            }
        );
        if (req.body.observacoes) detalhe.observacoes = req.body.observacoes;
        if (req.body.categoria) detalhe.categoria = req.body.categoria;
        await detalhe.save();
        const data = { ...detalhe.dataValues };
        //delete data.senha;
        return res.status(201).send(data).end();
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Erro interno' }).end();
    }
}

module.exports.delete = async (req, res) => {
    try {
        const detalhe = await Detalhe.findOne(
            {
                where: { "id": { [Op.eq]: req.body.id } }
            }
        );
        detalhe.destroy();
        return res.status(200).send({ message: 'Deletado' }).end();
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Erro interno' }).end();
    }
}