const q = 'logs'; 
const open = require('amqplib').connect('amqp://localhost');
const { logTypes } = require('../config')
console.log(logTypes)

//her har jeg lavet en genereisk logger, der sender shit til vores flask server
//du kan eventuelt sender forskellige objekter med, igennem forskellige funktioner bare hus, at brug 
//JSON.stringify (du kan også skifte fra promise til async await)
const createLogMessage = (content) =>{
    open.then(function(conn) {
        return conn.createChannel();
      }).then(function(ch) {
        return ch.assertQueue(q).then(function(ok) {
          return ch.sendToQueue(q, Buffer.from(JSON.stringify(content)));
        });
      }).catch(console.warn);
}

//createLogMessage({message: "hello blbla", pokemon: "id123", pokemon2: "id321"})

createLogMessage({type: logTypes.BATTLE, fight: "fight123", pokemon: "id123", pokemon2: "id321", turns: 10, winner: "id123"})


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