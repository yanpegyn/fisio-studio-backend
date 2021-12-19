const { Sequelize } = require('sequelize');

const models = [
    require('./models/Funcionario'),
    require('./models/Cliente'),
];

var sequelize;

module.exports = async (database, user, password, host, dialect) => {
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
        console.error("Model's successfully associated");
    } catch (error) {
        console.error("Unable to associate Model's:", error);
    }

    try {
        await sequelize.sync();
        console.error('Database successfully synchronized');
    } catch (error) {
        console.error('Unable to sync the database:', error);
    }

    return sequelize;
}
