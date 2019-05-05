const assert = require('assert')
const Postgres = require('./../db/strategies/postgres/postgres')
const HeroiSchema = require('./../db/strategies/postgres/schemas/heroisSchema')
const Context = require('./../db/strategies/base/contextStrategy')


const MOCK_HEROI_CADASTRAR = {
    nome: 'Gavião Negro',
    poder: 'flexas'
}

const MOCK_HEROI_ATUALIZAR = {
    nome: 'Homem de Ferro',
    poder: 'Armadura TOP'
}

let context = {}

describe('Postgres Strategy', function () {
    this.timeout(Infinity)
    this.beforeAll(async function () {
        const connection = await Postgres.connect()
        const model = await Postgres.defineModel(connection,HeroiSchema)
        context = new Context(new Postgres(connection, model))

        await context.delete()
        await context.create(MOCK_HEROI_ATUALIZAR)

    })

    it('PostgresSQL Connection', async function () {
        const result = await context.isConnected()
        assert.equal(result, true)
    })

    it('Cadastrar', async function () {
        const result = await context.create(MOCK_HEROI_CADASTRAR)
        delete result.id
        assert.deepEqual(result, MOCK_HEROI_CADASTRAR)
    })

    it('listar', async function () {
        const [result] = await context.read({ nome: MOCK_HEROI_CADASTRAR.nome })
        //pegar a primeira posição
        //const posicaoZero  = result[0]
        //const [posicao1,posicao2] = ['esse e o 1 ','esse e o 2']
        delete result.id
        assert.deepEqual(result, MOCK_HEROI_CADASTRAR)
    })

    it('atualizar', async function () {
        const [itemAtualizar] = await context.read({ nome: MOCK_HEROI_ATUALIZAR.nome })
        const novoItem = {
            ...MOCK_HEROI_ATUALIZAR,
            nome: 'Mulher MAravilha'
        }
        const [result] = await context.update(itemAtualizar.id, novoItem)
        const [itemAtualizado] = await context.read({ id: itemAtualizar.id })
        assert.deepEqual(itemAtualizado.nome, novoItem.nome)

        /*
            no JavaScript temos uma tecnica chamada rest/sprend que é um metodo usado para mergear objetos ou separa-los
            {
                nome: Batman,
                poder: Dinheiro
            }

            {
                dataNascimento: '1996-06-28'
            }

            //final
            {
                nome: Batman,
                poder: Dinheiro,
                dataNascimento: '1996-06-28'
            }
        */
    })

    it('remover', async function () {
        const [item] = await context.read({})
        const result = await context.delete(item.id)

        assert.deepEqual(result, 1)
    })
})