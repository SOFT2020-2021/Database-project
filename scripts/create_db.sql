--has to be run seperately, cannot be run in a transaction
DROP DATABASE IF EXISTS pokemon_db;
CREATE DATABASE pokemon_db;

DROP TABLE IF EXISTS trainers;
DROP TABLE IF EXISTS trainer_pokemons;
DROP TABLE IF EXISTS pokemons;
DROP TABLE IF EXISTS fight;
DROP TABLE IF EXISTS trainer_fights;

CREATE TABLE trainers (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(20) NOT NULL
);

CREATE TABLE pokemons (
    id          SERIAL PRIMARY KEY,
	name        VARCHAR(50) NOT NULL
);

CREATE TABLE trainer_pokemons (
    id          SERIAL PRIMARY KEY,
    trainer_id  INT REFERENCES trainers(id) ON DELETE CASCADE,
    pokemon_id  INT REFERENCES pokemons(id) ON DELETE CASCADE
);

CREATE TABLE fights (
    id          SERIAL PRIMARY KEY,
    winner      INT REFERENCES trainers(id) ON DELETE CASCADE,
    time        TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE trainer_fights (
    id          SERIAL PRIMARY KEY,
    trainer_id  INT REFERENCES trainers(id) ON DELETE CASCADE,
    fight_id    INT REFERENCES fights(id) ON DELETE CASCADE,
    winner      BOOLEAN
);