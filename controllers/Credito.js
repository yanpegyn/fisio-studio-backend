const { Op, ValidationError } = require("sequelize");
const { Credito } = global.sequelize.models;

module.exports.create = async (req, res) => {
    try {
        const credito = await Credito.build(
            {
                paciente: req.body.paciente,
                tipo: req.body.tipo,
                quantidade: req.body.quantidade,
                validade: req.body.validade
            }
        );
        await credito.save();
        const data = { ...credito.dataValues };
        return res.status(201).send(data).end();
    } catch (err) {
        if (err instanceof ValidationError) return res.status(400).send(err.errors[0].message).end();
        console.error(err);
        return res.status(500).send({ message: 'Erro interno' }).end();
    }
}

module.exports.read = async (req, res) => {
    try {
        const { id, paciente } = req.query;
        const credito = await (async (id, paciente) => {
            try {
                let where = null;
                if (id) {
                    where = { "id": { [Op.eq]: id } }
                } else if (paciente) {
                    where = { "paciente": { [Op.eq]: paciente } }, offset, limit
                } else return {};
                return await Credito.findOne({ where: where });
            } catch (err) {
                console.error(err);
                return {};
            }
        })(id, paciente);
        return res.status(200).send(credito).end();
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Erro interno' }).end();
    }
}

module.exports.update = async (req, res) => {
    try {
        const credito = await Credito.findOne(
            {
                where: { "id": { [Op.eq]: req.body.id } }
            }
        );
        if (req.body.paciente) detalhe.paciente = req.body.paciente;
        if (req.body.tipo) detalhe.tipo = req.body.tipo;
        if (req.body.quantidade) detalhe.quantidade = req.body.quantidade;
        if (req.body.validade) detalhe.validade = req.body.validade;
        await credito.save();
        const data = { ...credito.dataValues };
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
        const credito = await Credito.findOne(
            {
                where: { "id": { [Op.eq]: req.body.id } }
            }
        );
        credito.destroy();
        return res.status(200).send({ message: 'Deletado' }).end();
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Erro interno' }).end();
    }
}