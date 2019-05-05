const Hapi = require('hapi')

const MongoDB = require('./db/strategies/mongodb/mongodb')
const Postgres = require('./db/strategies/postgres/postgres')

const HeroiSchema = require('./db/strategies/mongodb/schemas/heroisSchema')
const UserSchema = require('./db/strategies/postgres/schemas/userSchema')

const Context = require('./db/strategies/base/contextStrategy')

const HeroRoute = require('./routes/heroRoutes')
const AuthRoute = require('./routes/authRoutes')


const HapiSwagger = require('hapi-swagger')
const Vision = require('vision')
const Inert = require('inert')
const HapiJwt = require('hapi-auth-jwt2')

const JWT_SECRET = "CHAVE_SECRETA"

const app = new Hapi.Server({
    port: 6040
})

let context, contextPostgres = {}

function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]())
}

async function main() {
    const connection = MongoDB.connect()
    context = new Context(new MongoDB(connection, HeroiSchema))

    const connectionPostgres = await Postgres.connect()
    const userSchema = await Postgres.defineModel(connectionPostgres, UserSchema)
    contextPostgres = new Context(new Postgres(connectionPostgres, userSchema))

    const options = {
        info: {
            title: 'API Herois',
            version: 'v1.0'
        },
        lang: 'pt'
    }

    await app.register([
        HapiJwt, Inert, Vision, {
            plugin: HapiSwagger,
            options
        }
    ])

    app.auth.strategy('jwt', 'jwt', {
        key: JWT_SECRET,
        /*options: {
            expiresIn: 20
        }*/
        validate: async (dado, request) => {
            const [result] = await contextPostgres.read({
                username: dado.username.toLowerCase(),
                id: dado.id
            })

            if(!result){
                return {
                    isValid: false
                }
            }
            return {
                isValid: true
            }
        }
    })

    app.auth.default('jwt')

    app.route([
        ...mapRoutes(new HeroRoute(context), HeroRoute.methods()),
        ...mapRoutes(new AuthRoute(JWT_SECRET, contextPostgres), AuthRoute.methods()),
    ])

    await app.start()
    console.log('Servidor rodando na porta', app.info.port)

    return app

}

module.exports = main()

