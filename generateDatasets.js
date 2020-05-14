
//env
const axios = require('axios')
const REDIS_PORT = process.env.REDISPORT || 6379;

//depdencies
const { pokemonLimit } = require('./config');
const redis = require('redis');
const apiUrl = `https://pokeapi.co/api/v2/pokemon/?limit=${pokemonLimit}`


//client initialization
const redisClient = redis.createClient(REDIS_PORT);


const pokeMapper = (pokemons) => {
    pokemons.forEach(pokemon =>{
        redisClient.hmset(pokemon.name, pokemon, function(err, result){
            if(err){
                console.log(err)
                throw new Error("Could not insert pokemon")
            }
            return result
        })
    })
 
}

const fetchData = async() =>{
    const response = await axios.get(apiUrl)
    if(response.status === 200){
        const pokemons = response.data.results
        pokeMapper(pokemons)
    }else{
        throw new Error("Could not get data")
    }
}

module.exports = {fetchData}
