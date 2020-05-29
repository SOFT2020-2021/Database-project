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
                    resolve()
                })
                .catch((e) => reject(e))
        })
    } catch (e) {
        throw Error(`something went wrong with deleting all rows: ${e}`)
    } finally {
        client.release()
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
    } catch (e) {
        throw Error(
            `something went wrong with populating trainer pokemons: ${e}`
        )
    } finally {
        client.release()
    }
}

const insertTrainer = async (trainerName) => {
    const client = await pool.connect()
    try {
        await client.query('INSERT INTO trainers(name) VALUES($1)', [
            trainerName,
        ])
    } catch (e) {
        throw Error(`something went wrong with getting trainer by id: ${e}`)
    } finally {
        client.release()
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
    } catch (e) {
        throw Error(`something went wrong with populating trainers: ${e}`)
    } finally {
        client.release()
    }
}

const populatePokemons = async (pokemons) => {
    const client = await pool.connect()
    try {
        const values = Object.values(pokemons).reduce((acc, cur, i) => {
            //acc.split(',').forEach(e => console.log(e))
            if(cur.name === undefined || cur.id === undefined){
                return acc
            }
            acc += `(${cur.id}, '${cur.name}')${
                i !== pokemons.length - 1 ? ',' : ';'
            }`
            return acc
        }, '')
        await client.query(`INSERT INTO 
                                pokemons(id, name)
                            VALUES ${values}`)
    } catch (e) {
        throw Error(`something went wrong with populate pokemons: ${e}`)
    } finally {
        client.release()
    }
}

const getTeam = async (trainerId) => {
    const client = await pool.connect()
    try {
        const pokemons = await client.query(
            `SELECT pokemon_id AS pokemon_id 
             FROM trainer_pokemons tp
             JOIN pokemons p ON p.id = tp.pokemon_id
             WHERE trainer_id = $1`,
            [trainerId]
        )
        if (pokemons.rows.length === 0) {
            throw Error('trainer does not exist')
        }
        return pokemons.rows
    } catch (e) {
        throw Error(`something went wrong with populate pokemons: ${e}`)
    } finally {
        client.release()
    }
}

const getRandomTrainer = async() =>{
const client = await pool.connect()
try{
    const user = await client.query(`
    SELECT id from trainers where id = (
        SELECT
   FLOOR(RANDOM() *
   (
      (SELECT
             min(id)  
          FROM
             trainers) -
      ((SELECT
            max(id)  
         FROM
            trainers) + 1
   )) +1
    ) + (SELECT
            max(id)  
         FROM
        trainers));`)
        return user.rows[0]
}catch(e){
    throw Error(`Could not fetch random user ${e}`)
}
}

const getTrainerById = async (userId) => {
    const client = await pool.connect()
    try {
        const user = await client.query(
            'SELECT * FROM trainers WHERE id = $1;',
            [userId]
        )
        return user.rows[0]
    } catch (e) {
        throw Error(`something went wrong with getting trainer by id: ${e}`)
    } finally {
        client.release()
    }
}

const getTrainerByName = async (name) => {
    const client = await pool.connect()
    try {
        const user = await client.query(
            'SELECT * FROM trainers WHERE name = $1;',
            [name]
        )
        return user.rows[0]
    } catch (e) {
        throw Error(`something went wrong with getting trainer by name: ${e}`)
    } finally {
        client.release()
    }
}

const updateTrainerName = async (newUserName, userId) => {
    const client = await pool.connect()
    try {
        await client.query('UPDATE trainers SET username = $1 WHERE id = $2;', [
            newUserName,
            userId,
        ])
        return true
    } catch (e) {
        throw Error(`something went wrong with updating a trainers name: ${e}`)
    } finally {
        client.release()
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
        return data.rows[0].name ? true : false
    } catch (e) {
        throw Error(`something went wrong with deleting a trainer: ${e}`)
    } finally {
        client.release()
    }
}

module.exports = {
    open,
    close,
    insertTrainer,
    getRandomTrainer,
    getTeam,
    deleteAllRows,
    getTrainerById,
    deleteTrainer,
    populateTrainers,
    populateTrainerPokemons,
    populatePokemons,
    updateTrainerName,
    getTrainerByName,
}
