const { Router } = require('express')
const redis = require('redis')
const axios = require('axios')

const { persistsPokemons, getPersistedPokemons } = require('./pokemon.persistenceManager')

const routes = Router()
const redisClient = redis.createClient()



routes.post('/create', async(req, res) =>{
    const { pokemons } = req.body;
    try{
        const promises = await persistsPokemons(redisClient, pokemons);
        const values = await Promise.all(promises);
        return res.json({pokemons: values, message: "created"}).status(201)
    }catch(error){
        console.log(error)
        return res.json(error).status(500)
    }
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
        console.log(obj.url)
        const pokemonData = await axios.get(obj.url);
        /*redisClient.hmset(name, {content: JSON.stringify(pokemonData.data)}, function(err, result){
            console.log(result)
            return result
        })
        */
        return res.json(pokemonData.data).status(200)
    })
})


routes.get('/persisted', async(req, res, next) =>{
    try{
        const pokemons = await getPersistedPokemons();
        console.log(pokemons)
        return res.json(pokemons).status(200)
    }catch(error){
        console.log(error);
        return res.json(error).status(500)
    }
})

module.exports = routes;