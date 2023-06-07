CREATE TABLE template_queue (
	id           INTEGER PRIMARY KEY ASC NOT NULL,
	submitter_id TEXT                    NOT NULL,
	submitted_at BIGINT                  NOT NULL,
	name         TEXT                    NOT NULL UNIQUE,
	url          TEXT                    NOT NULL UNIQUE,
	avatars      TEXT                    NOT NULL,
	boxes        TEXT                    NOT NULL
);
