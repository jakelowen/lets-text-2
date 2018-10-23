
-- EFFECTIVE TIMESTAMP
-- If message arrives before 8am set effective_timestamp to 8am same day
-- if arrives after 8pm set effective_timestamp to 8am next day
-- else pass through same timestamp
DROP FUNCTION set_effective_timestamp CASCADE;
CREATE OR REPLACE FUNCTION set_effective_timestamp()
  RETURNS trigger AS
$BODY$
BEGIN
  new.effective_timestamp = CASE
		WHEN 
			date_part('hour', (new.created_at AT TIME ZONE 'America/Chicago')) < 8 
			THEN 
				((date_trunc('day', (new.created_at AT TIME ZONE 'America/Chicago')) + '08:00:00')::timestamp AT TIME ZONE 'America/Chicago') AT TIME ZONE 'UTC'
		WHEN 
			date_part('hour', (new.created_at AT TIME ZONE 'America/Chicago')) >= 20
			THEN
				((date_trunc('day', date((new.created_at AT TIME ZONE 'America/Chicago'))+ '1 day'::interval) + '08:00:00')::timestamp AT TIME ZONE 'America/Chicago') AT TIME ZONE 'UTC'
		ELSE new.created_at
	END;
  RETURN NEW;
END;
$BODY$
LANGUAGE plpgsql
;

DROP TRIGGER IF EXISTS set_effective_timestamp_on_messages on messages;
CREATE TRIGGER set_effective_timestamp_on_messages
  BEFORE INSERT OR UPDATE ON messages
  FOR EACH ROW
  EXECUTE PROCEDURE set_effective_timestamp();