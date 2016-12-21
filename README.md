# parrot-bot
A Discord Bot that repeats information collected from Discord Chat.

Created By Matt Wenger

ADD the following in MySQL:
---------------


	IF YOU DO NOT WANT YOUR SCRIPT TO CRASH WHEN EMOJIS:
=========================================================================
CREATE DATABASE parrot_db CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
USE parrot_db;  
=========================================================================

	CREATE TABLE users 
	(
	id INT(6) AUTO_INCREMENT,
	usr_id VARCHAR(225),
	username VARCHAR(255),
	PRIMARY KEY (id),
	UNIQUE(usr_id)
	);

	CREATE TABLE word_table 
	(
	id INT(6) AUTO_INCREMENT,
	usr_id VARCHAR(225),
	word VARCHAR(255) UNIQUE,
	reg_date TIMESTAMP,
	PRIMARY KEY (id),
	FOREIGN KEY (usr_id) REFERENCES users(usr_id)
	);

	CREATE TABLE short_phrase_table 
	(
	id INT(6) AUTO_INCREMENT,
	usr_id VARCHAR(225),
	sentence VARCHAR(255),
	reg_date TIMESTAMP,
	PRIMARY KEY (id),
	FOREIGN KEY (usr_id) REFERENCES users(usr_id)
	);

	CREATE TABLE long_phrase_table 
	(
	id int(6) AUTO_INCREMENT,
	usr_id VARCHAR(225),
	sentence VARCHAR(255),
	reg_date TIMESTAMP,
	PRIMARY KEY (id),
	FOREIGN KEY (usr_id) REFERENCES users(usr_id)
	);  

	CREATE TABLE trophies 
	(
	id int(6) AUTO_INCREMENT,
	usr_id VARCHAR(225),
	trophy_count VARCHAR(255),
	date TIMESTAMP,
	PRIMARY KEY (id),
	FOREIGN KEY (usr_id) REFERENCES users(usr_id)
	);

	CREATE TABLE links 
	(
	id int(6) AUTO_INCREMENT,
	usr_id VARCHAR(225),
	link VARCHAR(255) UNIQUE,
	date TIMESTAMP,
	PRIMARY KEY (id),
	FOREIGN KEY (usr_id) REFERENCES users(usr_id)
	);
