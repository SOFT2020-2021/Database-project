--Should be run as owner of the database
CREATE USER pokemon_admin with encrypted password 'secret';

GRANT ALL               ON  SEQUENCE    fights_id_seq               TO pokemon_admin;
GRANT ALL               ON  SEQUENCE    trainer_fights_id_seq       TO pokemon_admin;
GRANT ALL               ON  SEQUENCE    trainers_id_seq             TO pokemon_admin;
GRANT ALL               ON  SEQUENCE    pokemons_id_seq             TO pokemon_admin;
GRANT ALL               ON  SEQUENCE    trainer_pokemons_id_seq     TO pokemon_admin;
GRANT ALL PRIVILEGES    ON  DATABASE    pokemon_db                  TO pokemon_admin;
GRANT ALL PRIVILEGES    ON  TABLE       trainers                    TO pokemon_admin;
GRANT ALL PRIVILEGES    ON  TABLE       trainer_pokemons            TO pokemon_admin;
GRANT ALL PRIVILEGES    ON  TABLE       pokemons                    TO pokemon_admin;
GRANT CONNECT           ON  DATABASE    pokemon_db                  TO pokemon_admin;
GRANT USAGE             ON  SCHEMA      public                      TO pokemon_admin;