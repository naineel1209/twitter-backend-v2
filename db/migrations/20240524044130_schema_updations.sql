-- migrate:up
ALTER TABLE users
    ADD COLUMN "followers_count"    integer DEFAULT 0,
    ADD COLUMN "following_count"    integer DEFAULT 0,
    ADD COLUMN "tweets_count"       integer DEFAULT 0,
    ADD COLUMN "liked_tweets_count" integer DEFAULT 0;

ALTER TABLE follower_following
    ADD CONSTRAINT "unique_follower_following" UNIQUE ("follower_id", "following_id");
-- migrate:down
ALTER TABLE follower_following
    DROP CONSTRAINT "unique_follower_following";

ALTER TABLE users
    DROP COLUMN "followers_count",
    DROP COLUMN "following_count",
    DROP COLUMN "tweets_count",
    DROP COLUMN "liked_tweets_count";
