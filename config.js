<<<<<<< HEAD
const production = true
const pokemonLimit = production ? 1000 : 2

module.exports = {
    pokemonLimit,
    production
}
=======
module.exports.tables = Object.freeze({
    tableName: "Pokemon"
})

module.exports.pokemonLimit = 1000


module.exports.logTypes = Object.freeze({
    BATTLE: "battle"
})
>>>>>>> 1d93fb771e3a2e8584a0a6835ba37741ddb74b63
