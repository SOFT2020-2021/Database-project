const axios = require('axios')
const { pokemonLimit } = require('../config')
const apiUrl = `https://pokeapi.co/api/v2/pokemon/?limit=${pokemonLimit}`

const getPokemons = async () => {
    return new Promise((resolve, reject) => {
        axios.get(apiUrl).then((response) => {
            if (response.status === 200) {
                const requests = []
                response.data.results.forEach((pokemon) => {
                    const pokemonRequest = new Promise((resolve) => {
                        axios
                            .get(pokemon.url, {
                                withCredentials: true, // if user login
                                timeout: 3000,
                            })
                            .then((response) => {
                                resolve(response.data)
                            })
                            .catch(() => {
                                resolve({})
                            })
                    })
                    requests.push(pokemonRequest)
                })
                Promise.all(requests).then((values) => {
                    resolve(values)
                })
            } else {
                reject('something went wrong getting the data')
            }
        })
    })
}

module.exports = {
    getPokemons,
}
