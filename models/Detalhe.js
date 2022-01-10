const { Model, DataTypes } = require('sequelize');

class Detalhe extends Model {
}

module.exports.makeModel = (sequelize) => {
    Detalhe.init({
        // Model attributes are defined here
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        agendamento: {
            type: DataTypes.INTEGER,
            foreignKey: true
        },
        observacoes: {
            type: DataTypes.STRING
        },
        categoria: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'Detalhe', // We need to choose the model name
        tableName: 'Detalhe', // We need to choose the table name
    });
}

module.exports.associate = (models) => {
    Detalhe.belongsTo(models.Agendamento, {
        sourceKey: 'id',
        foreignKey: 'agendamento',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
}