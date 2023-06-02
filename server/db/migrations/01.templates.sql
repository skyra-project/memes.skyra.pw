CREATE TABLE templates (
	name    TEXT    PRIMARY KEY NOT NULL,
	url     TEXT                NOT NULL UNIQUE,
	avatars TEXT                NOT NULL,
	boxes   TEXT                NOT NULL,
	uses    INTEGER DEFAULT 0
);

CREATE INDEX templates_name_value_index ON templates (name COLLATE NOCASE);
