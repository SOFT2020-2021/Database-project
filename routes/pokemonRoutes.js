const { Router } = require('express')
const mongoClient = require('../datasources/mongodb')
const redisClient = require('../datasources/redis')
const { trim } = require('../util/pokemonTrimmer')
const { segregate } = require('../util/segregateKnownPokemon')
const routes = Router()

routes.get('/full/:name', async (req, res) => {
    const pokemonDocument = await mongoClient.getByName(req.params.name)
    res.json(pokemonDocument)
})

routes.get('/all', async (req, res) => {
    try {
        const pokemonDocuments = await mongoClient.getAll()
        const pokemons = []
        pokemonDocuments.forEach((fullPokemon) => {
            pokemons.push(trim(fullPokemon))
        })
        res.json(pokemons)
    } catch (e) {
        res.status(500).send(`something went wrong: ${e}`)
    }
})

routes.get('/:id', async (req, res) => {
    const pokemons = await redisClient.getPokemons([req.params.id])
    const pokemonTeam = []
    const missing = segregate(pokemonTeam, pokemons)
    if (missing.length === 0) {
        res.json(pokemonTeam)
    } else {
        //getting the pokemons from mongodb
        const pokemons = await mongoClient.getMany(missing)

        //formatting them, excluding the unercersarry data
        pokemons.forEach((fullPokemon) => {
            pokemonTeam.push(trim(fullPokemon))
        })

        //inserting them into redis
        redisClient.persistPokemons(pokemonTeam)

        res.json(pokemonTeam)
    }
})

module.exports = routes
