const { Op, ValidationError } = require("sequelize");
const { Agendamento } = global.sequelize.models;

module.exports.create = async (req, res) => {
    try {
        const agendamento = await Agendamento.build(
            {
                paciente: req.body.paciente,
                tipo: req.body.tipo,
                inicio: req.body.inicio,
                fim: req.body.fim,
                valor: req.body.valor
            }
        );
        await agendamento.save();
        const data = { ...agendamento.dataValues };
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
        const { page, pageSize, id, paciente } = req.query;
        const offset = parseInt(page) * parseInt(pageSize);
        const limit = parseInt(pageSize);
        const agendamentos = await (async (id, paciente) => {
            try {
                if (id) {
                    return await Agendamento.findOne({
                        where: { "id": { [Op.eq]: id } }
                    });
                }
            } catch (err) {
                console.error(err);
                return {};
            }
            try {
                if (paciente) {
                    return await Agendamento.findAndCountAll({ where: { "paciente": { [Op.eq]: paciente } }, offset, limit });
                } else {
                    return await Agendamento.findAndCountAll({ offset, limit });
                }
            } catch (err) {
                console.error(err);
                return [];
            }
        })(id, paciente);
        return res.status(200).send(agendamentos).end();
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Erro interno' }).end();
    }
}

module.exports.update = async (req, res) => {
    try {
        const agendamento = await Agendamento.findOne(
            {
                where: { "id": { [Op.eq]: req.body.id } }
            }
        );
        if (req.body.paciente) agendamento.paciente = req.body.paciente;
        if (req.body.tipo) agendamento.tipo = req.body.tipo;
        if (req.body.inicio) agendamento.inicio = req.body.inicio;
        if (req.body.fim) agendamento.fim = req.body.fim;
        if (req.body.valor) agendamento.valor = req.body.valor;
        await agendamento.save();
        const data = { ...agendamento.dataValues };
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
        const agendamento = await Agendamento.findOne(
            {
                where: { "id": { [Op.eq]: req.body.id } }
            }
        );
        agendamento.destroy();
        return res.status(200).send({ message: 'Deletado' }).end();
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Erro interno' }).end();
    }
}