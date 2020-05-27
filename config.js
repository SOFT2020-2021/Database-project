const production = true
const pokemonLimit = production ? 1000 : 10
const logTypes = Object.freeze({
    BATTLE: 'battle',
})

module.exports = {
    pokemonLimit,
    production,
    logTypes,
}
