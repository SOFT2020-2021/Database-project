var q = 'logs';
 
var open = require('amqplib').connect('amqp://localhost');


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

createLogMessage({message: "hello blbla"})


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