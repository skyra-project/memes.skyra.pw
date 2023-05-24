CREATE TABLE templates (
	name    TEXT    PRIMARY KEY NOT NULL,
	url     TEXT                NOT NULL UNIQUE,
	avatars TEXT                NOT NULL,
	boxes   TEXT                NOT NULL,
	uses    INTEGER DEFAULT 0
);
