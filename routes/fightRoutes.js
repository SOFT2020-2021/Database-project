const { Router } = require('express')
//const mongoClient = require('../datasources/mongodb')
const routes = Router()
const fightController = require('../controllers/fight.controller')
const { getRandomTrainer } = require('../datasources/postgres'); 


//random fight
routes.post('/fight/', async (req, res) => {
    const {player1, player2} = req.body 
    try{
      const result = await fightController.twoPlayerFight(player1, player2);
      return res.status(200).json(result)
    }
    catch(e){
        console.error(e)
        return res.status(500).json(e)
    }
})

routes.post('/fight/random', async (req, res) => {
    const { player1 } = req.body 
    try{
      const result = await fightController.twoPlayerRandomFight(player1);
      return res.status(200).json(result)
    }
    catch(e){
        console.error(e)
        return res.status(500).json(e)
    }
})


routes.post('/fight/multi', async (req, res) => {
    const {player1, player2, player3, player4} = req.body 
    try{
      const result = await fightController.twoPlayerFight(player1, player2);
      return res.status(200).json(result)
    }
    catch(e){
        console.error(e)
        return res.status(500).json(e)
    }
})

module.exports = routes
