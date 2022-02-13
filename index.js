const db = require('./db');
const express = require('express');
const cors = require('cors')

const PORT = process.env.PORT || 5000;
require('dotenv').config();

const app = express();
global.sequelize;
db(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, process.env.DB_HOST, process.env.DB_DIALECT, process.env.SYNC).then(
    (sequelize) => {
        if (sequelize) {
            global.sequelize = sequelize;
            app.use(cors())
                .use(express.json())
                .use(express.urlencoded({ extended: true }))
                .use('/funcionario', require('./routes/CRUD_Funcionario'))
                .use('/cliente', require('./routes/Cliente'))
                .get('/login', require('../middlewares/Login'), (_req, res) => res.status(200).send("Success").end()) //403 - false / 200 - true
                ;
            app.listen(PORT, () => console.log(`Listening on ${PORT}`));
        }
    }
).catch(err => {
    console.error(err);
    console.error("Sequelize failed to access DB");
});


