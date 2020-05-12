const express = require('express');
const redis = require('redis');
const path = require('path')
const { createUUID } = require('./util/idGenerator') 
const bodyParser = require('body-parser')
const axios = require('axios');
const { fetchData } = require('./generateDatasets')
console.log(fetchData)


//Set Port 
const PORT = process.env.PORT || 3000;
console.log(PORT)
const REDIS_PORT = process.env.REDISPORT || 6379

//Init app
const app = express();
const redisClient = redis.createClient(REDIS_PORT);

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

redisClient.on('connect', () => console.log('Redis client connected'))




app.listen(PORT, async () => {
    fetchData(),
    console.log(`Listining  on ${PORT}`)
})


const pokemonController = require('./pokemon/pokemon.controller');

app.use('/pokemon', pokemonController)

app.get('/', (req, res) => {
    return res.json("OK").status(200)
})

//





app.post('/user/create', (req, res) =>{
    const user = {...req.body, id: createUUID()};

     redisClient.hmset(user.id, user, function(err, result){
        if(err){
            return res.json(err).status(500)
        }

        return res.json({message: result, user}).status(200)
    });

})

app.get('/user/search/:id', (req, res, next) =>{
    const id = req.params.id;


    redisClient.hgetall(id, function(err, obj){

        if(err){
            return res.json(err).status(500);
        }
        if(!obj){
            return res.json({message: `User id ${id} does not exists`}).status(401)
        }else{
            return res.json({user: obj}).status(200);
        }

    });
})

app.delete('/user/delete/:id', (req, res) =>{
    const id = req.params.id
    redisClient.del(id)
    return res.status(200).json({message: `user with id ${id} deleted succesfully`})
})
