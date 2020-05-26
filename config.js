const production = true
const pokemonLimit = production ? 1000 : 2
const tables = Object.freeze({
    tableName: 'Pokemon',
})
const logTypes = Object.freeze({
    BATTLE: 'battle',
})

module.exports = {
    pokemonLimit,
    production,
    tables,
    logTypes,
}
