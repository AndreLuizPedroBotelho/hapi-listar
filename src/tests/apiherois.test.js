const assert = require('assert')
const api = require('../api')
let app = {}
const MOCK_HEROI_CADASTRAR = {
    nome: 'Luffy',
    poder: 'borracha'
}

let MOCK_HEROI_ID = '';
let headers = '';
let MOCK_HEROI_ID_INVALIDO = '5cb276516c06b958b0b6ca4f';

const MOCK_HEROI_DEFAULT = {
    nome: `Robin- ${Date.now()}`,
    poder: 'Ser parceiro do batman'

}

const MOCK_HEROI_ATUALIZAR = {
    nome: `Patolino O Mago- ${Date.now()}`,
    poder: 'Implacável'
}

describe('Suite de testes da APi Heroes', function () {
    this.beforeAll(async () => {
        app = await api

        //get token
        const token = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'andreteste',
                password: '123'
            }
        })
        const dadosToken = JSON.parse(token.payload)
        headers = { Authorization: dadosToken.token }

        //cadastrar os default
        const result = await app.inject({
            method: 'POST',
            url: '/herois',
            headers,
            payload: JSON.stringify(MOCK_HEROI_DEFAULT)
        })
        const dados = JSON.parse(result.payload)
        MOCK_HEROI_ID = dados._id

    })

    it('listar /herois', async () => {
        const result = await app.inject({
            method: 'GET',
            headers,
            url: '/herois?skip=0&limit=10'
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 200)
        assert.ok(Array.isArray(dados))

    })
    it('listar /herois - deve filtrar 3 registros ', async () => {
        const TAMANHO_LIMITE = 3

        const result = await app.inject({
            method: 'GET',
            headers,
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 200)
        assert.ok(dados.length === TAMANHO_LIMITE)
    })

    it('listar /herois -limit errado', async () => {
        const TAMANHO_LIMITE = 'EEE'
        const result = await app.inject({
            method: 'GET',
            headers,
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`
        })

        const erroResult = {
            "statusCode": 400,
            "error": "Bad Request",
            "message": "child \"limit\" fails because [\"limit\" must be a number]",
            "validation": {
                "source": "query",
                "keys": ["limit"]
            }
        }
        
        assert.deepEqual(result.statusCode, 400)

        assert.deepEqual(result.payload, JSON.stringify(erroResult))
    })

    it('listar /herois - deve filtrar um item ', async () => {
        const NAME = MOCK_HEROI_DEFAULT.nome

        const result = await app.inject({
            method: 'GET',
            headers,
            url: `/herois?skip=0&limit=5000&nome=${NAME}`
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 200)
        assert.deepEqual(dados[0].nome, NAME)
    })

    it('cadastrar /herois-POST', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/herois',
            headers,
            payload: JSON.stringify(MOCK_HEROI_CADASTRAR)
        })

        const statusCode = result.statusCode
        const { message, _id } = JSON.parse(result.payload)
        assert.ok(statusCode === 200)
        assert.notStrictEqual(_id, undefined)
        assert.deepEqual(message, 'Heroi cadastrado com sucesso')
    })

    it('atualizar /herois/:id-PATCH', async () => {
        const _id = MOCK_HEROI_ID

        const result = await app.inject({
            method: 'PATCH',
            url: `/herois/${_id}`,
            headers,
            payload: JSON.stringify(MOCK_HEROI_ATUALIZAR)
        })

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.ok(statusCode === 200)
        assert.deepEqual(dados.message, 'Heroi atualizado com sucesso!')
    })

    it('atualizar /herois/:id-PATCH ->id errado', async () => {
        const _id = MOCK_HEROI_ID_INVALIDO

        const result = await app.inject({
            method: 'PATCH',
            url: `/herois/${_id}`,
            headers,
            payload: JSON.stringify(MOCK_HEROI_ATUALIZAR)
        })

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.ok(statusCode === 412)
        assert.deepEqual(dados.message, 'Id não encontrado!')
    })


    it('remover DELETE - /herois/:id', async () => {
        const _id = MOCK_HEROI_ID

        const result = await app.inject({
            method: 'DELETE',
            headers,
            url: `/herois/${_id}`,
        })

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.ok(statusCode === 200)
        assert.deepEqual(dados.message, 'Heroi Removido com sucesso!')
    })

    it('remover DELETE - /herois/:id ->id errado', async () => {
        const _id = MOCK_HEROI_ID_INVALIDO

        const result = await app.inject({
            method: 'DELETE',
            headers,
            url: `/herois/${_id}`,
        })

        const statusCode = result.statusCode


        const dados = JSON.parse(result.payload)

        assert.ok(statusCode === 412)
        assert.deepEqual(dados.message, 'Id não encontrado!')
    })

    it('remover DELETE - /herois/:id ->dado invalido', async () => {
        const _id = 'ID_INVALIDO'

        const result = await app.inject({
            method: 'DELETE',
            headers,
            url: `/herois/${_id}`,
        })

        const statusCode = result.statusCode


        const dados = JSON.parse(result.payload)

        assert.ok(statusCode === 500)
        assert.deepEqual(dados.message, 'An internal server error occurred')
    })
})