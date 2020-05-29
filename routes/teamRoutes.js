const { Router } = require('express')
const postgresClient = require('../datasources/postgres')
const redisClient = require('../datasources/redis')
const mongoClient = require('../datasources/mongodb')
const { trim } = require('../util/pokemonTrimmer')
const { segregate } = require('../util/segregateKnownPokemon')
const router = Router()

router.get('/:trainerId', async (req, res) => {
    try {
        const pokemonTeam = []

        //getting trainer teams from postgres
        const team = await postgresClient.getTeam(req.params.trainerId)
        const pokemonIds = team.reduce((acc, cur) => {
            acc.push(cur.pokemon_id)
            return acc
        }, [])

        //getting pokemons from redis
        const pokemons = await redisClient.getPokemons(pokemonIds)

        //inserts found pokemons into pokemonTeam and returns missing pokemon
        const missing = segregate(pokemonTeam, pokemons)

        //if no pokemons did not exist in redis,
        //we can assume we have the whole team and just return it without contacting mongodb
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
    } catch (e) {
        res.status(500).send(e.toString())
    }
})

router.put('/xD', async (req, res) => {
    try {
        console.log(req.body)
        const { currentPokemonId, newPokemonId, trainerId } = req.params
        postgresClient.updateTrainersPokemon(
            currentPokemonId,
            newPokemonId,
            trainerId
        )
        res.status(204).send('updated pokemon succesfully!')
    } catch (e) {
        res.status(500).send(`something went wrong on the server ${e}`)
    }
})

module.exports = router
