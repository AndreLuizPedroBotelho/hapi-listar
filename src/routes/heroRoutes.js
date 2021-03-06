const BaseRoute = require('./base/baseRoute')
const Joi = require('joi') //validação de requisição
const Boom = require('boom') //mensagem customizado para requisição

const failAction = (request, headers, erro) => {
    throw erro;
};

const headers = Joi.object({
    authorization: Joi.string().required()
}).unknown()

class HeroRoutes extends BaseRoute {
    constructor(db) {
        super()
        this.db = db
    }

    list() {
        return {
            path: '/herois',
            method: 'GET',
            config: {
                tags: ['api'],
                description: 'Deve listar herois',
                notes: 'Pode paginar resultado e filtrar por nome',
                validate: {
                    //payload->body
                    //headers-> header
                    //params-> na URL :id
                    //query -> ?ski=10&limit=10
                    failAction,
                    headers,
                    query: {
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10),
                        nome: Joi.string().min(3).max(100).default('')
                    }
                }
            },
            handler: (request, headers) => {
                try {
                    const { skip, limit, nome } = request.query;
                    const query = nome ? {
                        nome: {
                            $regex: `.*${nome}*.`
                        }
                    } : {}

                    query.nome = nome

                    return this.db.read(nome ? query : {}, skip, limit)

                } catch (error) {
                    return Boom.internal()
                }
            }
        }
    }

    create() {
        return {
            path: '/herois',
            method: 'POST',
            config: {
                tags: ['api'],
                description: 'Deve cadastrar herois',
                notes: 'Pode cadastrar um heroi',
                validate: {
                    //payload->body
                    //headers-> header
                    //params-> na URL :id
                    //query -> ?ski=10&limit=10
                    failAction,
                    headers,
                    payload: {
                        nome: Joi.string().required().min(3).max(100),
                        poder: Joi.string().required().min(2).max(100)
                    }

                }
            },
            handler: async (request) => {
                try {
                    const { nome, poder } = request.payload;
                    const result = await this.db.create({ nome, poder })

                    return {
                        message: 'Heroi cadastrado com sucesso',
                        _id: result._id
                    }

                } catch (error) {
                    return Boom.internal()
                }
            }
        }
    }

    update() {
        return {
            path: '/herois/{id}',
            method: 'PATCH',
            config: {
                tags: ['api'],
                description: 'Deve atualizar herois por id',
                notes: 'Pode atualizar um heroi',
                validate: {
                    //payload->body
                    //headers-> header
                    //params-> na URL :id
                    //query -> ?ski=10&limit=10
                    failAction,
                    headers,
                    params: {
                        id: Joi.string().required()
                    },
                    payload: {
                        nome: Joi.string().min(3).max(100),
                        poder: Joi.string().min(2).max(100)
                    }

                }
            },
            handler: async (request) => {
                try {
                    const { payload } = request;
                    const { id } = request.params;

                    const dadosString = JSON.stringify(payload)
                    const dados = JSON.parse(dadosString)

                    const result = await this.db.update(id, dados)
                    if (result.nModified !== 1) return Boom.preconditionFailed('Id não encontrado!')


                    return {
                        message: 'Heroi atualizado com sucesso!',
                    }

                } catch (error) {
                    return Boom.internal()
                }
            }
        }
    }

    delete() {
        return {
            path: '/herois/{id}',
            method: 'DELETE',
            config: {
                tags: ['api'],
                description: 'Deve deletar herois por id',
                notes: 'Pode deletar um heroi',
                validate: {
                    //payload->body
                    //headers-> header
                    //params-> na URL :id
                    //query -> ?ski=10&limit=10
                    failAction,
                    headers,
                    params: {
                        id: Joi.string().required()
                    }
                }
            },
            handler: async (request) => {
                try {
                    const { id } = request.params;
                    const result = await this.db.delete(id)
                    if (result.deletedCount !== 1) return Boom.preconditionFailed('Id não encontrado!')

                    return {
                        message: 'Heroi Removido com sucesso!',
                    }

                } catch (error) {
                    return Boom.internal()
                }
            }
        }
    }
}

module.exports = HeroRoutes

