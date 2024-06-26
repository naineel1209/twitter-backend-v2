-- migrate:up
CREATE TYPE "user_login_type" AS ENUM ('local', 'google');

CREATE TABLE "users"
(
    "id"                   serial PRIMARY KEY,
    "username"             varchar(255) UNIQUE NOT NULL,
    "name"                 varchar(255)        NOT NULL,
    "email"                varchar(255) UNIQUE,
    "password"             text,
    "bio"                  text,
    "dob"                  date,
    "profile_pic"          text,
    "cover_pic"            text,
    "local_refresh_token"  text,
    "google_refresh_token" text,
    "google_id"            varchar,
    "login_type"           user_login_type DEFAULT 'local',
    "is_deleted"           boolean         DEFAULT FALSE,
    "created_at"           timestamptz     DEFAULT NOW(),
    "updated_at"           timestamptz     DEFAULT NOW()
);

CREATE TABLE "tweets"
(
    "id"          serial PRIMARY KEY,
    "user_id"     integer REFERENCES users (id),
    "tweet"       text NOT NULL,
    "likes_count" integer     DEFAULT 0,
    "is_deleted"  boolean     DEFAULT FALSE,
    "created_at"  timestamptz DEFAULT NOW(),
    "updated_at"  timestamptz DEFAULT NOW(),
    "deleted_at"  timestamptz
);

CREATE TABLE "likes"
(
    "id"         serial PRIMARY KEY,
    "user_id"    integer REFERENCES users (id),
    "tweet_id"   integer REFERENCES tweets (id),
    "created_at" timestamptz DEFAULT NOW()
);

ALTER TABLE likes
    ADD CONSTRAINT unique_user_tweet UNIQUE (user_id, tweet_id);

CREATE TABLE "follower_following"
(
    "id"           serial PRIMARY KEY,
    "follower_id"  integer REFERENCES users (id),
    "following_id" integer REFERENCES users (id),
    "created_at"   timestamptz DEFAULT NOW()
);

-- migrate:down
DROP TABLE "follower_following";
ALTER TABLE "likes" DROP CONSTRAINT unique_user_tweet;
DROP TABLE "likes";
DROP TABLE "tweets";
DROP TABLE "users";
DROP TYPE IF EXISTS "user_login_type" CASCADE;
