const redis = require('redis')
const REDIS_PORT = process.env.REDISPORT || 6379
let redisClient

const open = async () => {
    try {
        await redis.createClient(REDIS_PORT)
    } catch (e) {
        throw new Error(e)
    }
}

const close = () => {
    redisClient.close()
}

const getPokemons = (pokemonKeys) => {
    const readOperations = pokemonKeys.map((pokemonKey) => {
        return new Promise((resolve, reject) => {
            redisClient.hgetall(pokemonKey, async function (err, pokemon) {
                if (err) {
                    reject(err)
                }
                /*const res = await getPokemon(pokemon.url)
                resolve(res.data)*/
            })
        })
    })
    return Promise.all(readOperations)
}

const persistPokemons = (pokemons) => {
    pokemons.forEach((pokemon) => {
        redisClient.hmset(pokemon.name, pokemon, function (err, result) {
            if (err) {
                console.log(err)
                throw new Error('Could not insert pokemon')
            }
            return result
        })
    })
}

module.exports = {
    open,
    close,
    persistPokemons,
    getPokemons,
}
