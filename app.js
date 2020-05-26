const app = require('express')()
const bodyParser = require('body-parser')
const redisClient = require('./datasources/redis')
const mongoClient = require('./datasources/mongodb')
const postgresClient = require('./datasources/postgres')
const pokemonRoutes = require('./routes/pokemonRoutes')
const trainerRoutes = require('./routes/trainerRoutes')
const teamRoutes = require('./routes/teamRoutes')
const pokemonApi = require('./util/pokemonApi')
const PORT = process.env.PORT || 3001

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json)
app.use('/pokemon', pokemonRoutes)
app.use('/trainer', trainerRoutes)
app.use('/team', teamRoutes)

app.listen(PORT, async () => {
    Promise.all([redisClient.open(), mongoClient.open(), postgresClient.open()])
        .then(async () => {
            await mongoClient.deleteAll()
            await postgresClient.deleteAllRows()
            const pokemons = await pokemonApi.getPokemons()
            Promise.all([
                mongoClient.insertMany(pokemons),
                postgresClient.populateTrainers(),
                postgresClient.populatePokemons(
                    pokemons.map((p) => ({ id: p.id, name: p.name }))
                ),
            ]).then(async () => {
                const pokemonDocuments = await mongoClient.getAll()
                await postgresClient.populateTrainerPokemons()
                pokemonDocuments.forEach((pokemon) => console.log(pokemon.name))
            })
        })
        .catch((e) => {
            console.warn(
                `something went wrong connecting to the databases: ${e}`
            )
        })
})
