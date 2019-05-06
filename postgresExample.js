const Sequelize = require('sequelize')
const driver = new Sequelize(
    'tb_herois',
    'postgres',
    'Postgres2019!',
    {
        host: 'postgres',
        port: 5432,
        dialect: 'postgres',
        quoteIdentifiers: false,
        operatorsAliases: false
    }
)

async function main() {
    const Herois = driver.define('tb_herois', {
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
    }, {
            tableName: 'tb_herois',
            freezeTableName: false,
            timestamps: false
        })
    await Herois.sync()
    await Herois.create({
        nome: 'Superman',
        poder: 'Todos'

    })

    const result = await Herois.findAll({
        raw: true,
        attributes:['nome']
    })

    console.log('result', result)
}
main()