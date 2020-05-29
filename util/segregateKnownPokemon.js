module.exports = {
    segregate: (pokemonTeam, pokemons) => {
        return Object.values(pokemons).reduce((acc, cur) => {
            if (Object.values(cur)[0] === null) {
                acc.push(Number(Object.keys(cur)[0]))
            } else {
                pokemonTeam.push(JSON.parse(Object.values(cur)[0]))
            }
            return acc
        }, [])
    },
}
