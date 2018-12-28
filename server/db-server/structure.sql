CREATE TABLE players (
    id serial PRIMARY KEY,
    account_id int, 
    region varchar(5),
    player_name varchar(255)
);

CREATE TABLE processed_games (
    game_id bigint,
    region varchar(5)
);

CREATE TABLE player_achievements (
    user_id int REFERENCES players(id),
    achievement_id int,
    achievement_level smallint,
    achieved_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY(user_id, achievement_id)
);

CREATE UNIQUE INDEX acc_region ON players (account_id, region);
CREATE UNIQUE INDEX game_region ON processed_games (game_id, region);
