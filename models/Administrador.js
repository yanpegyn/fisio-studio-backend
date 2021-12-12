const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

class Administrador extends Model {
    async efetuaLogin(senha) {
        return await bcrypt.compare(senha, this.senha);
    }
}

module.exports.makeModel = (sequelize) => {
    Administrador.init({
        // Model attributes are defined here
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        nome_de_usuario: {
            type: DataTypes.STRING
        },
        senha: {
            type: DataTypes.STRING
        }
    }, {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'Administrador', // We need to choose the model name
        tableName: 'Administrador', // We need to choose the table name
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

