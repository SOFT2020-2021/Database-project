const { Pool } = require('pg')

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
    getTrainerById,
    deleteTrainer,
    updateTrainerName,
    getTrainerByName,
}
