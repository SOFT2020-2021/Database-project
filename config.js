const production = false
const pokemonLimit = production ? 1000 : 10
const logTypes = Object.freeze({
    BATTLE: 'battle',
})

module.exports = {
    pokemonLimit,
    production,
    logTypes,
}
