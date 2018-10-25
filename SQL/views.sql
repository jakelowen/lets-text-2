-- This ages unprocessed messages and categorizes into age by 15 min chunks

DROP VIEW IF EXISTS unprocessed_message_age CASCADE;
CREATE VIEW unprocessed_message_age AS (
    SELECT DISTINCT ON (patron_id)
        patron_id, 
        -- age in timestamp
        (now() - effective_timestamp) as age 
        -- age in int minutes
        , EXTRACT(EPOCH FROM (now() - effective_timestamp)) / 60 as minutes 
        -- how many 15 min buckets have passed
        , ceil(EXTRACT(EPOCH FROM (now() - effective_timestamp)) / 60 / 15) as response_time_rating
    FROM (
        -- all this subquery does is filter and sort
        SELECT 
            *
            FROM message
            WHERE 
                -- no future messages
                effective_timestamp <= now()
                -- no processed messages
                AND session_timestamp is null
            -- oldest first
            ORDER BY effective_timestamp
    ) pre
);



-- this counts the # of unprocessed messages in each age bucket
DROP VIEW IF EXISTS unprocessed_message_rating_buckets CASCADE;
CREATE VIEW unprocessed_message_rating_buckets AS (
    SELECT 
        response_time_rating,
        count(*) as count
    FROM unprocessed_message_age
    GROUP BY 1
);


-- Performance calculations for completed sessions
CREATE VIEW session_response_performance AS (
    SELECT 
        sending_user_id
        , patron_id
        , session_timestamp as session
        , session_timestamp - earliest_effective_timestamp as response_time
        , ceil(EXTRACT(EPOCH FROM (session_timestamp - earliest_effective_timestamp)) / 60 / 15) as rating
    FROM (
        SELECT
            sending_user_id
            , patron_id
            , session_timestamp
            , min(effective_timestamp) as earliest_effective_timestamp
            --, session_timestamp - effective_timestamp as response_time
        FROM message
        WHERE direction = 'in'
        AND session_timestamp IS NOT NULL
        group by 1,2,3
    ) pre
);
