-- migrate:up
CREATE TABLE retweets
(
    id         serial PRIMARY KEY,
    tweet_id   integer NOT NULL REFERENCES tweets (id) ON DELETE CASCADE ON UPDATE CASCADE,
    user_id    integer NOT NULL REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamptz
);

ALTER TABLE tweets
    ADD COLUMN retweet_count INTEGER DEFAULT 0;

ALTER TABLE retweets
    ADD CONSTRAINT unique_user_tweet_retweet UNIQUE (user_id, tweet_id);

ALTER TABLE tweets
    ADD COLUMN is_quote_tweet BOOLEAN DEFAULT FALSE;

ALTER TABLE tweets
    ADD COLUMN attachment_tweet_id INTEGER REFERENCES tweets (id) ON DELETE SET NULL ON UPDATE CASCADE;

-- migrate:down
ALTER TABLE tweets
    DROP COLUMN is_quote_tweet;

ALTER TABLE tweets
    DROP COLUMN attachment_tweet_id;

ALTER TABLE retweets
    DROP CONSTRAINT unique_user_tweet_retweet;

ALTER TABLE tweets
    DROP COLUMN retweet_count;

DROP TABLE retweets;
