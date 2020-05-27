const q = 'logs'
/*const opt = {
    credentials: require('amqplib').credentials.plain('admin', 'admin2017'),
}
*/
const open = require('amqplib').connect('amqp://localhost') //add opt to add credentials
const { logTypes } = require('../config')
console.log(logTypes)

//her har jeg lavet en genereisk logger, der sender shit til vores flask server
//du kan eventuelt sender forskellige objekter med, igennem forskellige funktioner bare hus, at brug
//JSON.stringify (du kan også skifte fra promise til async await)
const createLogMessage = (content) => {
    open.then(function (conn) {
        return conn.createChannel()
    })
        .then(function (ch) {
            return ch.assertQueue(q).then(function () {
                return ch.sendToQueue(q, Buffer.from(JSON.stringify(content)))
            })
        })
        .catch(console.warn)
}

//createLogMessage({message: "hello blbla", pokemon: "id123", pokemon2: "id321"})


module.exports = {
  createLogMessage
}