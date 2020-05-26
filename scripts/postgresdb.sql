--Not meant to be ran as a script

DROP DATABASE IF EXISTS pokemon_db;
CREATE DATABASE pokemon_db;

CREATE USER pokemon_admin with encrypted password 'secret';

GRANT ALL PRIVILEGES ON DATABASE pokemon_db TO pokemon_admin;
GRANT ALL PRIVILEGES ON TABLE trainers TO pokemon_admin;
GRANT ALL PRIVILEGES ON TABLE trainer_pokemons TO pokemon_admin;
GRANT ALL PRIVILEGES ON TABLE pokemons TO pokemon_admin;


DROP TABLE IF EXISTS trainers;
DROP TABLE IF EXISTS traner_pokemons;
DROP TABLE IF EXISTS pokemons;

CREATE TABLE trainers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL
);

CREATE TABLE trainer_pokemons (
    id SERIAL PRIMARY KEY,
    trainer_id int REFERENCES trainers(id) ON DELETE CASCADE,
    pokemon_id int REFERENCES pokemons(id) ON DELETE CASCADE
);

CREATE TABLE pokemons (
    id SERIAL PRIMARY KEY,
	name VARCHAR(50) NOT NULL
);
