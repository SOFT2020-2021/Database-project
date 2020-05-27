const { Router } = require('express')
//const mongoClient = require('../datasources/mongodb')
const routes = Router()

routes.get('/fight/:playerId', async (req, res) => {
    res.send('Not implemented yet!')
})

module.exports = routes
