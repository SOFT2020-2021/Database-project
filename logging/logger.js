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


createLogMessage({
    type: logTypes.BATTLE,
    fight: 'fight122323233434342342345',
    pokemon: 'id12323423',
    pokemon2: 'id3321342',
    turns: 12,
    winner: 'id12233',
})
createLogMessage({
    type: logTypes.BATTLE,
    fight: 'fight332323232323652342342342343434',
    pokemon: 'id32342123',
    pokemon2: 'id22211234',
    turns: 17,
    winner: 'id212311',
})

//Test consumer //denne kan du bruge til at teste med.. RabbitMq benytter producer/consumer pattern

/*
const consumeMessage = () =>{
    open.then(function(conn) {
        return conn.createChannel();
      }).then(function(ch) {
        return ch.assertQueue(q).then(function(ok) {
          return ch.consume(q, function(msg) {
            if (msg !== null) {
              console.log(JSON.parse(msg.content.toString()));
              ch.ack(msg);
            }
          });
        });
      }).catch(console.warn);
}

setTimeout(() => consumeMessage(), 1000)

*/
