const { Router } = require('express')
const postgresClient = require('../datasources/postgres')
const redisClient = require('../datasources/redis')
const mongoClient = require('../datasources/mongodb')
const router = Router()

router.get('/:trainerId', async (req, res) => {
    try {
        const team = await postgresClient.getTeam(req.params.trainerId)
        console.log(Object.keys(team))
        const pokemons = await redisClient.getPokemons(Object.keys(team))
        const data = Object.values(pokemons).reduce((acc, cur) => {
            if(Object.values(cur)[0] === null){
                acc.missing.push(Object.keys(cur)[0])
            }
            return acc
        }, {pokemons: [], missing: []})
        if(data.missing.length === 0){
            res.json(data.pokemons)
        } else {
            const rez = await mongoClient.getMany(data.missing)
            console.log(rez)
        }
    } catch (e) {
        res.status(500).send(e.toString())
    }
})

module.exports = router
