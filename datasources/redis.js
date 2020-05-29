const redis = require('redis')
const REDIS_PORT = process.env.REDISPORT || 6379
let redisClient

const open = async () => {
    try {
        redisClient = await redis.createClient(REDIS_PORT)
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
            redisClient.get(pokemonKey, async function (err, pokemon) {
                if (err) {
                    reject(err)
                }
                resolve({ [pokemonKey]: pokemon })
            })
        })
    })
    return Promise.all(readOperations)
}

const persistPokemons = (pokemons) => {
    pokemons.forEach((pokemon) => {
        redisClient.set(pokemon.id, JSON.stringify(pokemon), function (err, result) {
            if (err) {
                console.log(err)
                throw new Error(`Could not insert pokemon, ${pokemon}`)
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
