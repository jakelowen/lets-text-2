
-- EFFECTIVE TIMESTAMP
-- If message arrives before 8am set effective_timestamp to 8am same day
-- if arrives after 8pm set effective_timestamp to 8am next day
-- else pass through same timestamp
DROP FUNCTION IF EXISTS set_effective_timestamp CASCADE;
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

DROP TRIGGER IF EXISTS set_effective_timestamp_on_message on message;
CREATE TRIGGER set_effective_timestamp_on_message
  BEFORE INSERT OR UPDATE ON message
  FOR EACH ROW
  EXECUTE PROCEDURE set_effective_timestamp();


--- CLOSE SESSIONS
--- If new message is outbound, close all existing inbound sessions, attribute to user
DROP FUNCTION IF EXISTS close_session_on_outbound_message CASCADE;
CREATE OR REPLACE FUNCTION close_session_on_outbound_message()
  RETURNS trigger AS
$BODY$
BEGIN
 IF NEW.direction = 'out' THEN
 UPDATE message set session_timestamp = new.created_at, sending_user_id = new.sending_user_id WHERE patron_id = new.patron_id and session_timestamp IS NULL;
 new.session_timestamp = new.created_at;
 END IF;
 RETURN NEW;
END;
$BODY$
LANGUAGE plpgsql
;

DROP TRIGGER IF EXISTS close_sessions on message;
CREATE TRIGGER close_sessions
  BEFORE INSERT OR UPDATE ON message
  FOR EACH ROW
  EXECUTE PROCEDURE close_session_on_outbound_message();