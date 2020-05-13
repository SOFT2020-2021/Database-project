const { tableName } = require('./config');
const DATABASE_NAME = process.env.DATABASE_NAME || "Pokemon"
const MongoClient = require('mongodb').MongoClient;
const MONGO_PORT = process.env.MONGOPORT || 27017;
const mongoUrl = `mongodb://localhost:${MONGO_PORT}`


const client = new MongoClient(mongoUrl)
let db = null
client.connect(function(err){
    if(err){
        console.log(err)
    }
     db = client.db(DATABASE_NAME)
})

module.exports.get = async () =>{
    let res = await db.collection(tableName).find({}).toArray()
    return res
}


module.exports.insert = (document) =>{
    return db.collection(tableName).insert(document, function(err, result){
        if(err){
            throw err
        }
        return result
    })

}