const assert = require('assert')
const MongoDB = require('./../db/strategies/mongodb/mongodb')
const HeroiSchema = require('./../db/strategies/mongodb/schemas/heroisSchema')
const Context = require('./../db/strategies/base/contextStrategy')

let context = {}

const MOCK_HEROI_CADASTRAR = {
    nome: 'Gavião Negro',
    poder: 'flexas'
}

const MOCK_HEROI_DEFAULT = {
    nome: `Homem Aranha- ${Date.now()}`,
    poder: 'Poder de aranha'
}

const MOCK_HEROI_ATUALIZAR = {
    nome: `Patolino O Mago- ${Date.now()}`,
    poder: 'Implacável'
}

let MOCK_HEROI_ID = ''

describe('MongoDB Suite de testes', function () {
    this.beforeAll(async () => {
        const connection = MongoDB.connect()
        context = new Context(new MongoDB(connection, HeroiSchema))

        await context.create(MOCK_HEROI_DEFAULT)
        const result = await context.create(MOCK_HEROI_ATUALIZAR)
        MOCK_HEROI_ID = result._id
    })

    it('verificar  conexão', async () => {
        const result = await context.isConnected()
        console.log('result', result)
        const expected = 'Conectado'

        assert.equal(result, expected)
    })

    it('cadastrar', async () => {
        const { nome, poder } = await context.create(MOCK_HEROI_CADASTRAR)
        assert.deepEqual({ nome, poder }, MOCK_HEROI_CADASTRAR)
    })

    it('atualizar', async () => {
        const result = await context.update(MOCK_HEROI_ID, {
            poder: 'Magia Implacavel'
        })

        assert.deepEqual(result.nModified, 1)
    })

    it('remover', async function () {
        const result = await context.delete(MOCK_HEROI_ID)

        assert.deepEqual(result.n, 1)
    })

    it('listar', async () => {
        const [{ nome, poder }] = await context.read({ nome: MOCK_HEROI_DEFAULT.nome })

        const result = {
            nome, poder
        }
        console.log('result', result)

        assert.deepEqual(result, MOCK_HEROI_DEFAULT)
    })
})
