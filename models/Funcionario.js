const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

class Funcionario extends Model {
    async efetuaLogin(senha) {
        return await bcrypt.compare(senha, this.senha);
    }
}

module.exports.makeModel = (sequelize) => {
    Funcionario.init({
        // Model attributes are defined here
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        nome_de_usuario: {
            type: DataTypes.STRING,
            unique: true
        },
        nome: {
            type: DataTypes.STRING
        },
        senha: {
            type: DataTypes.STRING,
            allowNull: false
        },
        endereco: {
            type: DataTypes.STRING,
            allowNull: false
        },
        data_de_nascimento: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        inicio_na_empresa: {
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
        },
        profissao: {
            type: DataTypes.STRING,
            allowNull: false
        },
        privilegio: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'Funcionario', // We need to choose the model name
        tableName: 'Funcionario', // We need to choose the table name
        timestamps: false, // Removes createdAt and updatedAt fields
        hooks: {
            beforeCreate: async (self, options) => {
                self.senha = await bcrypt.hash(self.senha, parseInt(5));
            },
            beforeUpdate: async (self, options) => {
                self.senha = await bcrypt.hash(self.senha, parseInt(5));
            }
        }, // Encrypt the password
    });
}

module.exports.associate = (_models) => {}
