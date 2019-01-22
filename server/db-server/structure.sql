
CREATE TABLE players (
    id serial PRIMARY KEY,
    account_id int, 
    encrypted_account_id varchar(255),
    region varchar(5),
    player_name varchar(255)
);

CREATE TABLE processed_games (
    game_id bigint,
    player_id int NOT NULL REFERENCES players(id),
    region varchar(5)
);


CREATE TABLE player_achievements (
    player_id int REFERENCES players(id),
    achievement_id int,
    champ_id int,
    skin_id int,
    achieved_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY(player_id, achievement_id)
);

CREATE TABLE groups (
    id serial PRIMARY KEY,
    name varchar(70),
    region varchar(5)
);

CREATE TABLE group_members (
    id serial primary key,
    group_id int NOT NULL REFERENCES groups(id),
    player_id int NOT NULL REFERENCES players(id),
    owner boolean,
    member_since TIMESTAMP default now()
);


CREATE TYPE invite_status AS ENUM ('accepted', 'declined', 'pending', 'canceled');
CREATE TABLE group_invites (
    id serial primary key,
    group_id int NOT NULL references groups(id),
    invitee int NOT NULL references players(id),
    inviter int NOT NULL references players(id),
    status invite_status default 'pending',
    invite_date TIMESTAMP default now()
);


CREATE TABLE group_achievements (
    id serial primary key,
    group_id int NOT NULL REFERENCES groups(id),
    achievement_id int,
    champ_id int,
    achieved_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE group_achievement_participants (
    group_achievement_id int NOT NULL references group_achievements(id),
    member_id int NOT NULL references group_members(id)
);

CREATE TABLE processed_group_games (
    game_id bigint,
    region varchar(5),
    group_id int NOT NULL REFERENCES groups(id)
);


CREATE UNIQUE INDEX group_invite_player ON group_invites(group_id, invitee);
CREATE UNIQUE INDEX group_achievements_unique ON group_achievements(group_id, achievement_id);

CREATE UNIQUE INDEX acc_region ON players (account_id, region);
CREATE UNIQUE INDEX game_region ON processed_games (game_id, region);
CREATE UNIQUE INDEX processed_game_player ON processed_games(game_id, player_id, region);
CREATE UNIQUE INDEX group_members_idx ON group_members(group_id, player_id);