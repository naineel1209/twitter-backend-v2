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
    ADD COLUMN retweets_count INTEGER DEFAULT 0;

ALTER TABLE retweets
    ADD CONSTRAINT unique_user_tweet_retweet UNIQUE (user_id, tweet_id);

ALTER TABLE tweets
    ADD COLUMN is_quote_tweet BOOLEAN DEFAULT FALSE;

ALTER TABLE tweets
    ADD COLUMN attachment_tweet_id INTEGER REFERENCES tweets (id) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE tweets
    ADD COLUMN quotes_count INTEGER DEFAULT 0;

CREATE INDEX idx_tweets_quoted_tweet_id ON tweets(attachment_tweet_id);
CREATE INDEX idx_tweets_user_id ON tweets(user_id);
CREATE INDEX idx_retweets_tweet_id ON retweets(tweet_id);
CREATE INDEX idx_retweets_user_id ON retweets(user_id);
CREATE INDEX idx_likes_tweet_id ON likes(tweet_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);

-- migrate:down

DROP INDEX idx_likes_user_id;
DROP INDEX idx_likes_tweet_id;
DROP INDEX idx_retweets_user_id;
DROP INDEX idx_retweets_tweet_id;
DROP INDEX idx_tweets_user_id;
DROP INDEX idx_tweets_quoted_tweet_id;

ALTER TABLE tweets
    DROP COLUMN quotes_count;

ALTER TABLE tweets
    DROP COLUMN is_quote_tweet;

ALTER TABLE tweets
    DROP COLUMN attachment_tweet_id;

ALTER TABLE retweets
    DROP CONSTRAINT unique_user_tweet_retweet;

ALTER TABLE tweets
    DROP COLUMN retweets_count;

DROP TABLE retweets;
