module.exports = {
    trim: (fullPokemon) => {
        const trimmedPokemon = {
            id: fullPokemon.id,
            name: fullPokemon.name,
        }
        if (fullPokemon.stats !== undefined) {
            trimmedPokemon.stats = fullPokemon.stats.reduce((acc, cur) => {
                acc[cur.stat.name] = cur.base_stat
                return acc
            }, {})
        } else {
            trimmedPokemon.stats = undefined
        }
        if (fullPokemon.moves !== undefined) {
            trimmedPokemon.moves = fullPokemon.moves.reduce((acc, cur) => {
                acc.push(cur.move.name)
                return acc
            }, [])
        } else {
            trimmedPokemon.moves = undefined
        }
        return trimmedPokemon
    },
}
