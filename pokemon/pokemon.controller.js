const { Router } = require('express')
const redis = require('redis')
const axios = require('axios')

const { persistsPokemons } = require('./pokemon.persistenceManager')

const routes = Router()
const redisClient = redis.createClient()



routes.post('/create', async(req, res) =>{
    const { pokemons } = req.body;
    console.log('body is')
    console.log(req.body)
    try{
        const promises = await persistsPokemons(redisClient, pokemons);
        console.log(promises)
    }catch(error){
        console.log(error)
        return res.json(error).status(500)
    }
    return res.json({message: "Pokemons stored in db"}).status(201)
})

routes.get('/all', async(req, res) =>{
    redisClient.keys("*", async function(err, keys){
        if(err){
            return res.json(err).status(500)
        }
        
        //can not use hgetall inside a loop..
        
        return res.json(keys).status(200)

    })
})

routes.get('/get/:name', async(req, res) =>{
    const name = req.params.name
    console.log(typeof name)
    redisClient.hgetall(name, async function(err, obj){
        if(err){
            return res.json(err).status(500)
        }
        console.log(obj.name)
        const pokemonData = await axios.get(obj.url);
        return res.json(pokemonData.data).status(200)
    })
})

module.exports = routes;