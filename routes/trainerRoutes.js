const { Router } = require('express')
const postgresClient = require('../datasources/postgres')
const router = Router()
const { createLogMessage } = require('../logging/logger')
const { logTypes } = require('../config')

router.post('/create', async (req, res) => {

    const { name, ids } = req.body;

    try{
    const response = await postgresClient.insertTrainer(name, ids);
    createLogMessage({content: req.body, type: logTypes.CREATE_USER});
    return res.status(200).json({message: `User ${name} created successfully`})
    }catch(e){
        console.log(e)
        return res.status(500).json(e)
    }
})

module.exports = router