const ICrud = require('./../interfaces/interfaceCrud')

const Mongoose = require('mongoose')
const STATUS = {
    0: 'Desconectado',
    1: 'Conectado',
    2: 'Conectando',
    3: 'Desconectando'
}
class MongoDB extends ICrud {
    constructor(connection, schema) {
        super()
        this._connection = connection
        this._schema = schema
    }

    async isConnected() {
        const state = STATUS[this._connection.readyState]
        if (state === 'Conectado') return state;

        if (state !== 'Conectando') return state;

        await new Promise(resolve => setTimeout(resolve, 1500))
        return STATUS[this._connection.readyState]
    }

    static connect() {
        Mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true }, function (error) {
            if (!error) return;
            console.log('Falha na conexão!', error)
        })

        const connection = Mongoose.connection

        connection.once('open', () => console.log('database rodando!!'))
        return connection
    }

    async update(id, item) {
        return this._schema.updateOne({ _id: id }, { $set: item })
    }

    async create(item) {
        return this._schema.create(item)
    }

    async delete(id) {
        return this._schema.deleteOne({ _id: id })
    }

    async read(item, skip = 0, limit = 10) {
        return this._schema.find(item).skip(skip).limit(limit)
    }

}

module.exports = MongoDB