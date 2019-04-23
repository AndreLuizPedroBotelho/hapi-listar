const Sequelize = require('sequelize')

const heroiSchema = {
    name: 'tb_herois',
    schema: {
        id: {
            type: Sequelize.INTEGER,
            required: true,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: Sequelize.STRING,
            required: true,
        },
        poder: {
            type: Sequelize.STRING,
            required: true,
        }
    },
    options: {
        tableName: 'tb_herois',
        freezeTableName: false,
        timestamps: false
    }
}

module.exports = heroiSchema
