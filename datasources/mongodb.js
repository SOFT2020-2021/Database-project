const DATABASE_NAME = process.env.DATABASE_NAME || 'pokemondb'
const MongoClient = require('mongodb').MongoClient
const MONGO_PORT = process.env.MONGOPORT || 27017
const connectionString = `mongodb://localhost:${MONGO_PORT}`
const client = new MongoClient(connectionString, { useUnifiedTopology: true })
const collectionName = 'pokemons'
let db = null

const open = () => {
    return new Promise((resolve, reject) => {
        client.connect(function (err) {
            if (err) reject(err)
            db = client.db(DATABASE_NAME)
            resolve({})
        })
    })
}

const close = () => {
    db.close()
}

const getAll = async () => {
    return new Promise((resolve, reject) => {
        db.collection(collectionName)
            .find({})
            .toArray((err, result) => {
                if (err) reject(err)
                resolve(result)
            })
    })
}

const insertMany = (documents) => {
    return new Promise((resolve, reject) => {
        db.collection(collectionName).insertMany(documents, (err, result) => {
            if (err) reject(err)
            resolve({ insertedDocuments: result.insertedCount })
        })
    })
}

const getMany = (ids) => {
    return new Promise((resolve, reject) => {
        db.collection(collectionName).find(
            { 'id': { $in: ids } },
            (err, result) => {
                if (err) reject(err)
                console.log(result.result)
                resolve(result)
            }
        )
    })
}

const deleteAll = () => {
    return new Promise((resolve, reject) => {
        db.collection(collectionName).deleteMany({}, function (err, result) {
            if (err) reject(err)
            resolve({ removed: result.result.n })
        })
    })
}

const getByName = (name) => {
    return new Promise((resolve, reject) => {
        db.collection(collectionName).find({ name }, function (err, result) {
            if (err) reject(err)
            resolve({ removed: result.result.n })
        })
    })
}

module.exports = {
    getByName,
    getMany,
    deleteAll,
    getAll,
    insertMany,
    open,
    close,
}
