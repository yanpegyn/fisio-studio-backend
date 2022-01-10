const { Model, DataTypes } = require('sequelize');

class Agendamento extends Model {
}

module.exports.makeModel = (sequelize) => {
    Agendamento.init({
        // Model attributes are defined here
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        paciente: {
            type: DataTypes.INTEGER,
            foreignKey: true
        },
        tipo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        inicio: {
            type: DataTypes.DATE,
            allowNull: false
        },
        fim: {
            type: DataTypes.DATE,
            allowNull: false
        },
        valor: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
    }, {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'Agendamento', // We need to choose the model name
        tableName: 'Agendamento', // We need to choose the table name
    });
}

module.exports.associate = (models) => {
    Agendamento.belongsTo(models.Cliente, {
        sourceKey: 'paciente',
        foreignKey: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    Agendamento.hasOne(models.Detalhe, {
        sourceKey: 'id',
        foreignKey: 'agendamento',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
}

