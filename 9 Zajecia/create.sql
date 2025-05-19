DROP TABLE IF EXISTS person;
DROP TABLE IF EXISTS address;
DROP TABLE IF EXISTS job_position;

CREATE TABLE address (
	id SERIAL PRIMARY KEY,
	locality VARCHAR(30),
	street VARCHAR(30),
	house_number INTEGER,
	apartment_number INTEGER,
	postal_code CHAR(6)
);

CREATE TABLE job_position (
	id SERIAL PRIMARY KEY,
	title VARCHAR(30),
	salary  DECIMAL(8, 2)
);

CREATE TABLE person (
	id SERIAL PRIMARY KEY,
	address_id INTEGER REFERENCES address(id),
	job_position_id INTEGER REFERENCES job_position(id),
	first_name VARCHAR(30),
	last_name VARCHAR(30),
	gender CHAR(1),
	birth_date DATE, 
	pesel CHAR(11)
);