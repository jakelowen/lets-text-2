-- This ages unprocessed messages and categorizes into age by 15 min chunks

DROP VIEW IF EXISTS unprocessed_message_age CASCADE;
CREATE VIEW unprocessed_message_age AS (
	SELECT DISTINCT ON (contact_id)
		contact_id, 
		-- age in timestamp
		(now() - effective_timestamp) as age 
		-- age in int minutes
		, EXTRACT(EPOCH FROM (now() - effective_timestamp)) / 60 as minutes 
		-- how many 15 min buckets have passed
		, ceil(EXTRACT(EPOCH FROM (now() - effective_timestamp)) / 60 / 15) as on_call_rating 
	FROM (
		-- all this subquery does is filter and sort
		SELECT 
			*
			FROM messages
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
		on_call_rating,
		count(*) as count
	FROM unprocessed_message_age
	GROUP BY 1
);
