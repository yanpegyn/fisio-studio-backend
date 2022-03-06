const db = require('./db');
const express = require('express');
const cors = require('cors')

const PORT = process.env.PORT || 5000;
require('dotenv').config();

const app = express();
global.sequelize;
db(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, process.env.DB_HOST, process.env.DB_DIALECT, process.env.SYNC).then(
    async (sequelize) => {
        if (sequelize) {
            global.sequelize = sequelize;

            //Cria um usuário padrão se não existir
            const [_user, created] = await global.sequelize.models.Funcionario.findOrCreate({
                where: {
                    "privilegio": { [Op.eq]: 1 }
                },
                defaults: {
                    nome_de_usuario: "ADM",
                    nome: "ADM",
                    senha: "12345678",
                    endereco: "Online",
                    data_de_nascimento: '2000-01-01',
                    inicio_na_empresa: '2000-01-01',
                    telefone: '34988887777',
                    CPF: '713.642.150-04',
                    profissao: 'Dono',
                    privilegio: 1
                }
            });
            if (created) {
                console.log("Dono Criado");
            }

            app.use(cors())
                .use(express.json())
                .use(express.urlencoded({ extended: true }))
                .use('/funcionario', require('./routes/CRUD_Funcionario'))
                .use('/cliente', require('./routes/Cliente'))
                .get('/login', require('./middlewares/Login'), (_req, res) => res.status(200).send("Success").end()) //403 - false / 200 - true
                ;
            app.listen(PORT, () => console.log(`Listening on ${PORT}`));
        }
    }
).catch(err => {
    console.error(err);
    console.error("Sequelize failed to access DB");
});


