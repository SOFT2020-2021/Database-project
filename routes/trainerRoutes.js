const { Router } = require('express')
const postgresClient = require('../datasources/postgres')
const router = Router()

router.post('/:name', (req, res) => {
    postgresClient.insertTrainer(req.params.name).then(() => {
        res.status(200).send('OK')
    })
})

module.exports = router