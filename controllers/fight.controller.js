const { logTypes } = require('../config')
const { createUUID } = require('../util/idGenerator')
const { createLogMessage } = require('../logging/logger')
const { getRandomTrainer } = require('../datasources/postgres'); 


const pokemons = ["pikachu", "ratata", "mewtwo", "onyx", "geodude", "abra"]
const generateFightData = (participant1, participant2) =>{
    /*
    get pokemon
    */
    return{
    type: logTypes.BATTLE,
    fight: createUUID(),
    participants: [
    {trainer1: participant1},
    {trainer2: participant2},
    ],
    turns: Math.floor(Math.random() * 70 / 2),
    winner: pokemons[Math.floor(Math.random())],
    damageDealt:  Math.floor(Math.random() * 7000),
    mvp: pokemons[Math.floor(Math.random() * pokemons.length)],
    type: "double"
    }
}

const generateMultiFightData = (participants) =>{
    /*
    get pokemon
    */
   console.log(participants)
   const mappedParticipants = participants.map((entry, i) => {
       return {["trainer"+(i+1)]: entry}
   })
    return{
    type: logTypes.BATTLE,
    fight: createUUID(),
    participants: mappedParticipants,
    turns: Math.floor(Math.random() * 70 / 2),
    winner: pokemons[Math.floor(Math.random())],
    damageDealt:  Math.floor(Math.random() * 7000),
    mvp: pokemons[Math.floor(Math.random() * pokemons.length)],
    type: "multi"
    }
}


const twoPlayerRandomFight = async (participant) =>{
    const randomParticipant = getRandomTrainer()
    const fightData = generateFightData(participant, randomParticipant)
    try{
        createLogMessage(fightData)
    }catch(err){
        console.log(err)
        throw(err)
    }
    return fightData
}



const twoPlayerFight = async (participant1, participant2) =>{
    const fightData = generateFightData(participant1, participant2)
    try{
        createLogMessage(fightData)
    }catch(err){
        console.log(err)
        throw(err)
    }
    return fightData
}


const multiPlayerFight = (participants) =>{
    const fightData = generateMultiFightData(participants);
    try{
        createLogMessage(fightData);
    }catch(err){
        console.log(err)
        throw(err)
    }
    return fightData
}


module.exports = {
    twoPlayerFight,
    multiPlayerFight,
    twoPlayerRandomFight
}

const data = twoPlayerFight("Hans", "Erik")
const _data = multiPlayerFight(["Hans", "moster", "søster", "hanne"])
console.log(data)
console.log(_data)