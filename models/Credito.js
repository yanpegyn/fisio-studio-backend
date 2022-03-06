const { Model, DataTypes } = require('sequelize');

class Credito extends Model {
}

module.exports.makeModel = (sequelize) => {
    Credito.init({
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
        quantidade: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        validade: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        valor_unidade: {
            type: DataTypes.DECIMAL(2,10),
            allowNull: false
        }
    }, {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'Credito', // We need to choose the model name
        tableName: 'Credito', // We need to choose the table name
    });
}

module.exports.associate = (models) => {
    Credito.belongsTo(models.Cliente, {
        sourceKey: 'id',
        foreignKey: 'paciente',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
}
