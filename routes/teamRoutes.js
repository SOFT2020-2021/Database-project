const { Router } = require('express')
const postgresClient = require('../datasources/postgres')
const router = Router()

router.get('/:trainerId', async (req, res) => {
    try {
        const team = await postgresClient.getTeam(req.params.trainerId)
        res.json(team)
    } catch (e) {
        res.status(500).send(e.toString())
    }
})

module.exports = router
