const app = require('express')()
const bodyParser = require('body-parser')
const redisClient = require('./datasources/redis')
const mongoClient = require('./datasources/mongodb')
const postgresClient = require('./datasources/postgres')
const pokemonRoutes = require('./routes/pokemonRoutes')
const trainerRoutes = require('./routes/trainerRoutes')
const fightRoutes = require('./routes/fightRoutes')
const teamRoutes = require('./routes/teamRoutes')
const pokemonApi = require('./util/pokemonApi')
const cliProgress = require('cli-progress')
const { production } = require('./config')
const PORT = process.env.PORT || 3001

app.use(bodyParser.json())
app.use('/pokemon', pokemonRoutes)
app.use('/trainer', trainerRoutes)
app.use('/team', teamRoutes)
app.use('/fight', fightRoutes)

Promise.all([
    redisClient.open(),
    mongoClient.open(),
    postgresClient.open(),
]).then(async () => {
    if (!production) {
        app.use('', (req, res, next) => {
            console.log(`
                url: ${req.url}
                body: ${JSON.stringify(req.body)}
                method: ${req.method}
            `)
            next()
        })
        app.listen(PORT, () => {
            console.log(
                `server is running on http://localhost:127.0.0.1:${PORT}`
            )
        })
    } else {
        app.listen(PORT, async () => {
            const s = Date.now()
            const progressBar = new cliProgress.SingleBar(
                {},
                cliProgress.Presets.shades_classic
            )
            progressBar.start(200, 0)
            await mongoClient.deleteAll()
            await postgresClient.deleteAllRows()
            progressBar.update(50)
            const pokemons = await pokemonApi.getPokemons()
            progressBar.update(100)
            await mongoClient.insertMany(pokemons)

            Promise.all([
                postgresClient.populateTrainers(),
                postgresClient.populatePokemons(
                    pokemons.map((p) => ({ id: p.id, name: p.name }))
                ),
            ])
                .then(async () => {
                    progressBar.update(150)
                    try {
                        await postgresClient.populateTrainerPokemons()
                        progressBar.update(200)
                        progressBar.stop()
                        console.log(
                            `server started on http://localhost:${PORT} succesfully! Took ${
                                Date.now() - s
                            }ms`
                        )
                    } catch (e) {
                        console.warn(`something went wrong ${e}`)
                    }
                })
                .catch((e) => console.warn(`something went wrong! ${e}`))
        })
    }
})
