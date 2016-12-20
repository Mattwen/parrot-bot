# parrot-bot
A Discord Bot that repeats information collected from Discord Chat.

Created By Matt Wenger

ADD the following in MySQL:
---------------


	CREATE parrot_db;
	USE parrot_db;

	CREATE TABLE users 
	(
	id int(18) PRIMARY KEY,
	username VARCHAR(255) UNIQUE,
	entry VARCHAR(255),
	date TIMESTAMP
	);

	CREATE TABLE word_table 
	(
  	id INT(6) AUTO_INCREMENT,
	usr_id INT(18),
  	word VARCHAR(255) UNIQUE,
  	reg_date TIMESTAMP,
	PRIMARY KEY (id),
	FOREIGN KEY (usr_id) REFERENCES users(id)
	);

	CREATE TABLE short_phrase_table 
	(
  	id INT(6) AUTO_INCREMENT,
	usr_id INT(18),
  	sentence VARCHAR(255),
  	reg_date TIMESTAMP,
	PRIMARY KEY (id),
	FOREIGN KEY (usr_id) REFERENCES users(id)
	);
  
	CREATE TABLE long_phrase_table 
	(
  	id int(6) AUTO_INCREMENT,
	usr_id INT(18),
  	sentence VARCHAR(255),
  	reg_date TIMESTAMP,
	PRIMARY KEY (id),
	FOREIGN KEY (usr_id) REFERENCES users(id)
	);	
	
	CREATE TABLE trophies 
	(
	id int(6) AUTO_INCREMENT,
	usr_id INT(18),
	trophy_count VARCHAR(255),
	date TIMESTAMP,
	PRIMARY KEY (id),
	FOREIGN KEY (usr_id) REFERENCES users(id)
	);
	
	CREATE TABLE links 
	(
	id int(6) AUTO_INCREMENT,
	usr_id INT(18)
	link VARCHAR(255),
	date TIMESTAMP,
	PRIMARY KEY (id),
	FOREIGN KEY (usr_id) REFERENCES users(id)
	);



