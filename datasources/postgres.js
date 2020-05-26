const { Pool } = require('pg')
const trainers = require('../data/trainers.json')

const pool = new Pool({
    user: 'pokemon_admin',
    host: 'localhost',
    database: 'pokemon_db',
    password: 'secret',
    port: 5432,
})

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
})

const open = () => {
    return pool.connect()
}

const close = () => {
    return pool.end()
}

const deleteAllRows = async () => {
    const client = await pool.connect()
    try {
        return new Promise((resolve, reject) => {
            Promise.all([
                (client.query('DELETE FROM trainers WHERE 1 > 0'),
                client.query('DELETE FROM pokemons WHERE 1 > 0'),
                client.query('DELETE FROM trainer_pokemons WHERE 1 > 0')),
            ])
                .then(() => {
                    client.release()
                    resolve()
                })
                .catch((e) => reject(e))
        })
    } catch (e) {
        client.release()
        throw Error(`something went wrong with deleting all rows: ${e}`)
    }
}

const populateTrainerPokemons = async () => {
    const client = await pool.connect()
    try {
        await client.query(`
            INSERT INTO trainer_pokemons(trainer_id, pokemon_id)
            select tr.id, x.id
            from trainers tr
            cross join lateral (
                select id
                from pokemons
                order by random() 
                limit 6
            ) x`)
        client.release()
    } catch (e) {
        client.release()
        throw Error(
            `something went wrong with populating trainer pokemons: ${e}`
        )
    }
}

const insertTrainer = async (trainerName) => {
    const client = await pool.connect()
    try {
        await client.query('INSERT INTO trainers(name) VALUES($1)', [
            trainerName,
        ])
        client.release()
    } catch (e) {
        client.release()
        throw Error(`something went wrong with getting trainer by id: ${e}`)
    }
}

const populateTrainers = async () => {
    const client = await pool.connect()
    try {
        const values = Object.values(trainers).reduce((acc, cur, i) => {
            acc += `('${cur}')${i !== trainers.length - 1 ? ',' : ';'}`
            return acc
        }, '')
        await client.query(`INSERT INTO 
                                trainers(name) 
                            VALUES ${values}`)
        client.release()
    } catch (e) {
        client.release()
        throw Error(`something went wrong with populating trainers: ${e}`)
    }
}

const populatePokemons = async (pokemons) => {
    const client = await pool.connect()
    try {
        const values = Object.values(pokemons).reduce((acc, cur, i) => {
            acc += `(${cur.id}, '${cur.name}')${
                i !== pokemons.length - 1 ? ',' : ';'
            }`
            return acc
        }, '')

        await client.query(`INSERT INTO 
                                pokemons(id, name)
                            VALUES ${values}`)
        client.release()
    } catch (e) {
        client.release()
        throw Error(`something went wrong with populate pokemons: ${e}`)
    }
}

const getTrainerById = async (userId) => {
    const client = await pool.connect()
    try {
        const user = await client.query(
            'SELECT * FROM trainers WHERE id = $1;',
            [userId]
        )
        client.release()
        return user.rows[0]
    } catch (e) {
        client.release()
        throw Error(`something went wrong with getting trainer by id: ${e}`)
    }
}

const getTrainerByName = async (name) => {
    const client = await pool.connect()
    try {
        const user = await client.query(
            'SELECT * FROM trainers WHERE name = $1;',
            [name]
        )
        client.release()
        return user.rows[0]
    } catch (e) {
        client.release()
        throw Error(`something went wrong with getting trainer by name: ${e}`)
    }
}

const updateTrainerName = async (newUserName, userId) => {
    const client = await pool.connect()
    try {
        await client.query('UPDATE trainers SET username = $1 WHERE id = $2;', [
            newUserName,
            userId,
        ])
        client.release()
        return true
    } catch (e) {
        client.release()
        throw Error(`something went wrong with updating a trainers name: ${e}`)
    }
}

const deleteTrainer = async (trainerId) => {
    const client = await pool.connect()
    try {
        const data = await client.query(
            `DELETE FROM trainers
                            WHERE id = $1
                            RETURNING(name);`,
            [trainerId]
        )
        client.release()
        return data.rows[0].name ? true : false
    } catch (e) {
        client.release()
        throw Error(`something went wrong with deleting a trainer: ${e}`)
    }
}

module.exports = {
    open,
    close,
    insertTrainer,
    deleteAllRows,
    getTrainerById,
    deleteTrainer,
    populateTrainers,
    populateTrainerPokemons,
    populatePokemons,
    updateTrainerName,
    getTrainerByName,
}
