const { Op, ValidationError } = require("sequelize");
const { Agendamento, Funcionario, Cliente } = global.sequelize.models;
const { getCreditos } = require("./Credito");
const isNumeric = (input) => (input - 0) == input && ("" + input).length > 0;
const convertDate = (date) => date.split("T")[0].split(" ")[0].split("-").filter((_v, i) => i >= 0);

module.exports.create = async (req, res) => {
    try {
        const dataInformada = convertDate(req.body.inicio);
        const marcandoI = new Date(req.body.inicio);
        const marcandoF = new Date(req.body.fim);

        let paciente = null;
        if (isNumeric(req.body.paciente)) {
            paciente = req.body.paciente;
        } else if (req.body.pacienteCPF) {
            let cli = await Cliente.findOne({
                where: { "CPF": { [Op.eq]: req.body.pacienteCPF } },
                attributes: ['id']
            });
            if (!cli) return res.status(404).send({ message: "CPF Cliente not Found" });
            paciente = cli.id;
        } else {
            return res.status(400).send({ message: "Informe o Id ou o CPF do Cliente" }).end();
        }

        let funcionario = null;
        if (isNumeric(req.body.funcionario)) {
            funcionario = req.body.funcionario;
        } else if (req.body.funcionarioCPF) {
            let fun = await Funcionario.findOne({
                where: { "CPF": { [Op.eq]: req.body.funcionarioCPF } },
                attributes: ['id']
            });
            if (!fun) return res.status(404).send({ message: "CPF Funcionário not Found" });
            funcionario = fun.id;
        } else {
            return res.status(400).send({ message: "Informe o Id ou o CPF do Funcionário" }).end();
        }

        let reDate = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])[ T](0[0-9]|1[0-9]|2[1-4]):(0[0-9]|[1-5][0-9]):(0[0-9]|[1-5][0-9]))/;
        if (!reDate.exec(req.body.inicio)) return res.status(400).send({ message: "Inicio inválido" }).end();
        if (!reDate.exec(req.body.fim)) return res.status(400).send({ message: "Fim inválido" }).end();

        const agendamentos = await getHorarios(dataInformada[0], dataInformada[1], dataInformada[2]);
        for (let i = 0; i < agendamentos.length; i++) {
            if ((marcandoI >= req.body.inicio && marcandoI <= req.body.fim) || (marcandoF >= req.body.inicio && marcandoF <= req.body.fim)) {
                if (agendamentos[i].paciente == paciente) {
                    return res.status(400).send({ message: "O paciente esta ocupado esse horário" }).end();
                } else if (agendamentos[i].funcionario == funcionario) {
                    return res.status(400).send({ message: "O funcionário esta ocupado esse horário" }).end();
                }
            }
        }

        //Verifica se o Cliente tem creditos para agendar
        if (!req.body.hoje) {
            req.body.hoje = new Date();
        }
        const creditos = getCreditos(paciente, req.body.tipo, req.body.hoje, "Validos");
        console.log("creditos");
        console.log(creditos);
        let credito = null;
        for (let i = 0; i < creditos.length; i++) {
            console.log("i = " + i);
            if (creditos[i].quantidade != 0) {
                console.log("achou o crédito");
                credito = creditos[i];
                break;
            }
        }
        console.log("credito");
        console.log(credito);
        if (!credito) return res.status(400).send({ message: "O cliente não tem créditos suficientes" }).end();

        const agendamento = await Agendamento.build(
            {
                paciente: paciente,
                funcionario: funcionario,
                tipo: req.body.tipo,
                inicio: req.body.inicio,
                fim: req.body.fim,
                credito: credito.id
            }
        );

        credito.quantidade -= 1;
        credito.consumidos += 1;

        await agendamento.save();
        await credito.save();

        const data = { ...agendamento.dataValues };
        //delete data.senha;
        return res.status(201).send(data).end();
    } catch (err) {
        if (err instanceof ValidationError) return res.status(400).send({ message: err.errors[0].message }).end();
        console.error(err);
        return res.status(500).send({ message: 'Erro interno' }).end();
    }
}

module.exports.read = async (req, res) => {
    try {
        const { page, pageSize, id, q_paciente, q_funcionario, q_pacienteCPF, q_funcionarioCPF } = req.query;
        const offset = parseInt(page) * parseInt(pageSize);
        const limit = parseInt(pageSize);

        let paciente = null;
        if (isNumeric(q_paciente)) {
            paciente = q_paciente;
        } else if (q_pacienteCPF) {
            let cli = await Cliente.findOne({
                where: { "CPF": { [Op.eq]: q_pacienteCPF } },
                attributes: ['id']
            });
            if (!cli) return res.status(404).send({ message: "CPF Cliente not Found" });
            paciente = cli.id;
        }

        let funcionario = null;
        if (isNumeric(q_funcionario)) {
            funcionario = q_funcionario;
        } else if (q_funcionarioCPF) {
            let fun = await Funcionario.findOne({
                where: { "CPF": { [Op.eq]: q_funcionarioCPF } },
                attributes: ['id']
            });
            if (!fun) return res.status(404).send({ message: "CPF Funcionário not Found" });
            funcionario = fun.id;
        }

        const agendamentos = await (async (id, paciente, funcionario) => {
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
                } else if (funcionario) {
                    return await Agendamento.findAndCountAll({ where: { "funcionario": { [Op.eq]: funcionario } }, offset, limit });
                } else {
                    return await Agendamento.findAndCountAll({ offset, limit });
                }
            } catch (err) {
                console.error(err);
                return [];
            }
        })(id, paciente, funcionario);
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

        let paciente = null;
        if (isNumeric(req.body.paciente)) {
            paciente = req.body.paciente;
        } else if (req.body.pacienteCPF) {
            let cli = await Cliente.findOne({
                where: { "CPF": { [Op.eq]: req.body.pacienteCPF } },
                attributes: ['id']
            });
            if (!cli) return res.status(404).send({ message: "CPF Cliente not Found" });
            paciente = cli.id;
        }

        let funcionario = null;
        if (isNumeric(req.body.funcionario)) {
            funcionario = req.body.funcionario;
        } else if (req.body.funcionarioCPF) {
            let fun = await Funcionario.findOne({
                where: { "CPF": { [Op.eq]: req.body.funcionarioCPF } },
                attributes: ['id']
            });
            if (!fun) return res.status(404).send({ message: "CPF Funcionário not Found" });
            funcionario = fun.id;
        }

        if (paciente) agendamento.paciente = paciente;
        if (funcionario) agendamento.funcionario = funcionario;
        if (req.body.tipo) agendamento.tipo = req.body.tipo;
        if (req.body.inicio) agendamento.inicio = req.body.inicio;
        if (req.body.fim) agendamento.fim = req.body.fim;
        if (req.body.credito) agendamento.credito = req.body.credito;
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

module.exports.horarios = async (req, res) => {
    try {
        const { ano, mes, dia } = req.query;
        const agendamentos = await getHorarios(ano, mes, dia);
        for (let i = 0; i < agendamentos.length; i++) {
            const fun = await Funcionario.findByPk(agendamentos[i].funcionario, {
                attributes: ['id', 'nome', 'CPF', 'profissao']
            });
            const pac = await Cliente.findByPk(agendamentos[i].paciente, {
                attributes: ['id', 'nome', 'CPF']
            });
            agendamentos[i].funcionario = fun;
            agendamentos[i].paciente = pac;
        }
        return res.status(200).send(agendamentos).end();
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Erro interno' }).end();
    }
}

const getHorarios = async (ano, mes, dia) => {
    try {
        if (!isNumeric(ano)) return [];
        let and = [sequelize.where(sequelize.fn('year', sequelize.col('inicio')), ano)];
        if (isNumeric(dia)) and.push(sequelize.where(sequelize.fn('day', sequelize.col('inicio')), dia));
        if (isNumeric(mes)) and.push(sequelize.where(sequelize.fn('month', sequelize.col('inicio')), mes));
        return await Agendamento.findAll({
            where: {
                [Op.and]: and
            },
            attributes: { exclude: ['createdAt', 'updatedAt', 'credito'] }
        });
    } catch (err) {
        console.error(err);
        return [];
    }
}

