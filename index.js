const db = require('./db');
const express = require('express');
const cors = require('cors')

const PORT = process.env.PORT || 5000;
require('dotenv').config();



const app = express()
    .use(cors())
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use('/funcionario', require('./routes/CRUD_Funcionario'))
    .use('/cliente', require('./routes/Cliente'))
    ;

global.sequelize;
db(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, process.env.DB_HOST, process.env.DB_DIALECT).then(
    (sequelize) => {
        if (sequelize) {
            app.listen(PORT, () => console.log(`Listening on ${PORT}`));
            global.sequelize = sequelize;
        }
    }
);
