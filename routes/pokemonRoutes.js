const { Router } = require('express')
const mongoClient = require('../datasources/mongodb')
const routes = Router()

routes.get('/get/:name', async (req, res) => {
    const pokemonDocument = await mongoClient.getByName(req.params.name)
    res.json(pokemonDocument)
})

routes.get('/all', async (req, res) => {
    const pokemonDocuments = await mongoClient.getAll()
    res.json(pokemonDocuments)
})

module.exports = routes
