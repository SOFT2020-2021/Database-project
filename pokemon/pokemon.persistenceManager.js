const  { db } = require('../generateDatasets');
const axios = require('axios');
const databaseMapper = require('../databaseMapper')


const persistsPokemons = async (redisClient, pokemons) =>{
    return pokemons.map(async pokemon => {
        redisClient.hgetall(pokemon, (async function(err, pokemon){
            if(err){
                console.log(err)
            }
            try{
            const res = await axios.get(pokemon.url)
            const result = databaseMapper.insert(res.data)
            return result
            }catch(err){
                console.log(err)
                throw err
            }
        }))
        return pokemon
    });
}

const getPersistedPokemons = async () =>{
    const pokemons = await databaseMapper.get();
    console.log(pokemons)
    return pokemons
}

module.exports = {
    persistsPokemons, 
    getPersistedPokemons
}