DROP TABLE IF EXISTS person;
DROP TABLE IF EXISTS address;
DROP TABLE IF EXISTS job_position;

CREATE TABLE address (
	id INTEGER PRIMARY KEY,
	locality TEXT,
	street TEXT,
	house_number INTEGER,
	apartment_number INTEGER,
	postal_code TEXT
);

CREATE TABLE job_position (
	id INTEGER PRIMARY KEY,
	title TEXT,
	salary NUMERIC
);

CREATE TABLE person (
	id INTEGER PRIMARY KEY,
	address_id INTEGER REFERENCES address(id),
	job_position_id INTEGER REFERENCES job_position(id),
	first_name TEXT,
	last_name TEXT,
	gender TEXT,
	birth_date TEXT, 
	pesel TEXT
);