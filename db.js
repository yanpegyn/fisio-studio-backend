const { Sequelize } = require('sequelize');

const models = [
    require('./models/Funcionario'),
    require('./models/Cliente'),
    require('./models/Agendamento'),
    require('./models/Detalhe'),
    require('./models/Credito'),
];

var sequelize;

module.exports = async (database, user, password, host, dialect, sync) => {
    sequelize = new Sequelize(database, user, password, {
        host: host,
        dialect: dialect/* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
    });

    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

    try {
        for (const model of models) {
            model.makeModel(sequelize);
        }
        console.error("Model's has been created successfully.");
    } catch (error) {
        console.error("Unable to create Model's:", error);
    }

    try {
        for (const model of models) {
            model.associate(sequelize.models);
        }
        console.error("Model's successfully associated");
    } catch (error) {
        console.error("Unable to associate Model's:", error);
    }

    try {
        let conf = { force: false, alter: false };
        if (sync && ['force', 'alter'].includes(sync)) conf[sync] = true;
        await sequelize.sync(conf);
        console.error('Database successfully synchronized');
    } catch (error) {
        console.error('Unable to sync the database:', error);
    }

    return sequelize;
}
