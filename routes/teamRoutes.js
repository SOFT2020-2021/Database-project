const { Router } = require('express')
const postgresClient = require('../datasources/postgres')
const redisClient = require('../datasources/redis')
const mongoClient = require('../datasources/mongodb')
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

        //dividing known pokemons and missing pokemons
        const missing = Object.values(pokemons).reduce((acc, cur) => {
            if (Object.values(cur)[0] === null) {
                acc.push(Number(Object.keys(cur)[0]))
            } else {
                pokemonTeam.push(JSON.parse(Object.values(cur)[0]))
            }
            return acc
        }, [])

        //if no pokemons did not exist in redis,
        //we can assume we have the whole team and just return it without contacting mongodb
        if (missing.length === 0) {
            res.json(pokemonTeam)
        } else {
            //getting the pokemons from mongodb
            const pokemons = await mongoClient.getMany(missing)

            //formatting them, excluding the unercersarry data
            pokemons.forEach((fullPokemon) => {
                const trimmedPokemon = {
                    id: fullPokemon.id,
                    name: fullPokemon.name,
                }
                trimmedPokemon.stats = fullPokemon.stats.reduce((acc, cur) => {
                    acc[cur.stat.name] = cur.base_stat
                    return acc
                }, {})
                trimmedPokemon.moves = fullPokemon.moves.reduce((acc, cur) => {
                    acc.push(cur.move.name)
                    return acc
                }, [])
                pokemonTeam.push(trimmedPokemon)
            })
            //inserting them into redis
            redisClient.persistPokemons(pokemonTeam)

            res.json(pokemonTeam)
        }
    } catch (e) {
        res.status(500).send(e.toString())
    }
})

module.exports = router
