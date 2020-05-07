const  { db } = require('../generateDatasets');
const axios = require('axios');
const databaseMapper = require('../databaseMapper')


const persistsPokemons = async (redisClient, pokemons) =>{
    pokemons.forEach(async pokemon => {
        redisClient.hgetall(pokemon, (async function(err, pokemon){
            if(err){
                console.log(err)
            }
            try{
            const res = await axios.get(pokemon.url)
            console.log(res.data)
            const reuslt = databaseMapper.insert(res.data)
            console.log(reuslt)
            }catch(err){
                console.log(err)
                throw err
            }
          
        }))

        return true
    });
}

module.exports = {
    persistsPokemons
}