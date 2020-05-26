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
            console.log('opened all connections succesfully')
            await mongoClient.deleteAll()
            const pokemons = await pokemonApi.getPokemons()
            await mongoClient.insertMany(pokemons)
            const pokemonDocuments = await mongoClient.getAll()
            pokemonDocuments.forEach((pokemon) => console.log(pokemon.name))
        })
        .catch((e) => {
            console.warn(
                `something went wrong connecting to the databases: ${e}`
            )
        })
})
