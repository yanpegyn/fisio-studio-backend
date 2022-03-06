const { Op, ValidationError } = require("sequelize");
const { Credito } = global.sequelize.models;

const getCreditos = async (paciente, tipo, hoje, only) => {
    const creditos = await (async (paciente, tipo, hoje) => {
        try {
            let where = null;
            if (only && only == "Validos" && tipo) {
                //Créditos válidos do tipo
                where = { "paciente": { [Op.eq]: paciente }, "tipo": { [Op.eq]: tipo }, "validade": { [Op.gte]: hoje } };
            } else if (only && only == "Validos") {
                //Todos créditos válidos
                where = { "paciente": { [Op.eq]: paciente }, "validade": { [Op.gte]: hoje } };
            } else if (only && only == "Vencidos" && tipo) {
                //Créditos vencidos do tipo
                where = { "paciente": { [Op.eq]: paciente }, "tipo": { [Op.eq]: tipo }, "validade": { [Op.lt]: hoje } };
            } else if (only && only == "Vencidos") {
                //Todos créditos vencidos
                where = { "paciente": { [Op.eq]: paciente }, "validade": { [Op.lt]: hoje } };
            }
            return await Credito.findAll({ where: where, order: ['validade', 'ASC'], });
        } catch (err) {
            console.error(err);
            return {};
        }
    })(paciente, tipo, hoje);
    return creditos;
}
module.exports.getCreditos = getCreditos;

module.exports.getValidos = async (req, res) => {
    try {
        if (req.query.paciente && req.query.hoje) {
            const data = await getCreditos(req.query.paciente, req.query.tipo, req.query.hoje, "Validos");
            return res.status(200).send(data).end();
        }
        if (!req.query.paciente) return res.status(400).send("'paciente' inválido").end();
        if (!req.query.hoje) return res.status(400).send("Data 'hoje' inválida").end();
    } catch (err) {
        if (err instanceof ValidationError) return res.status(400).send(err.errors[0].message).end();
        console.error(err);
        return res.status(500).send({ message: 'Erro interno' }).end();
    }
}

module.exports.getVencidos = async (req, res) => {
    try {
        if (req.query.paciente && req.query.hoje) {
            const data = await getCreditos(req.query.paciente, req.query.tipo, req.query.hoje, "Vencidos");
            return res.status(200).send(data).end();
        }
        if (!req.query.paciente) return res.status(400).send("'paciente' inválido").end();
        if (!req.query.hoje) return res.status(400).send("Data 'hoje' inválida").end();
    } catch (err) {
        if (err instanceof ValidationError) return res.status(400).send(err.errors[0].message).end();
        console.error(err);
        return res.status(500).send({ message: 'Erro interno' }).end();
    }
}

module.exports.create = async (req, res) => {
    try {
        const credito = await Credito.build(
            {
                paciente: req.body.paciente,
                tipo: req.body.tipo,
                quantidade: req.body.quantidade,
                validade: req.body.validade,
                valor_unidade: req.body.valor_unidade
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
                    where = { "paciente": { [Op.eq]: paciente } }
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
        if (req.body.paciente) credito.paciente = req.body.paciente;
        if (req.body.tipo) credito.tipo = req.body.tipo;
        if (req.body.quantidade) credito.quantidade = req.body.quantidade;
        if (req.body.validade) credito.validade = req.body.validade;
        if (req.body.valor_unidade) credito.validade = req.body.valor_unidade;
        await credito.save();
        const data = { ...credito.dataValues };
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