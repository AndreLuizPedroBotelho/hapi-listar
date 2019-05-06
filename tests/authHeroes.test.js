const assert = require('assert')
const api = require('./../api')
const Context = require('./../src/db/strategies/base/contextStrategy')
const Postgres = require('./../src/db/strategies/postgres/postgres')
const UserSchema = require('./../src/db/strategies/postgres/schemas/userSchema')

let app = {}

const USER = {
    username: 'andreteste',
    password: '123'
}

const USER_DB = {
    username: USER.username.toLowerCase(),
    password: '$2b$04$tpgW7l/XeCtn0j33Zk5qIOWEqtVneh5D.lto7rpe/zHTOr3uz/yiu'
}

describe('Auth test suite', function () {
    this.beforeAll(async () => {
        app = await api

        const connectionPostgres = await Postgres.connect();
        const model = await Postgres.defineModel(connectionPostgres, UserSchema)
        const postgres = new Context(new Postgres(connectionPostgres, model))
        await postgres.update(null, USER_DB, true)
    })

    it('deve obter um token', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: USER
        })
        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 200)
        assert.ok(dados.token.length > 10)

    })

    it('deve retornar não autorizado ao tentar com login errado', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'andre',
                password: 'teste'
            }
        })
        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 401)
        assert.deepEqual(dados.error,'Unauthorized')

    })
})