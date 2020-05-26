const production = true
const pokemonLimit = production ? 1000 : 2
const logTypes = Object.freeze({
    BATTLE: 'battle',
})

module.exports = {
    pokemonLimit,
    production,
    logTypes,
}
