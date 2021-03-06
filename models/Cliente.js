const { Model, DataTypes } = require('sequelize');
//const bcrypt = require('bcrypt');

class Cliente extends Model {
}

module.exports.makeModel = (sequelize) => {
    Cliente.init({
        // Model attributes are defined here
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        nome: {
            type: DataTypes.STRING
        },
        endereco: {
            type: DataTypes.STRING,
            allowNull: false
        },
        data_de_nascimento: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        telefone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        CPF: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'Cliente', // We need to choose the model name
        tableName: 'Cliente', // We need to choose the table name
    });
}

module.exports.associate = (models) => {
    Cliente.hasMany(models.Agendamento, {
        sourceKey: 'id',
        foreignKey: 'paciente',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    Cliente.hasMany(models.Credito, {
        sourceKey: 'id',
        foreignKey: 'paciente',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
}