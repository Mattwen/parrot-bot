# parrot-bot
A Discord Bot that repeats information collected from Discord Chat.

Created By Matt Wenger

ADD the following in MySQL:
---------------


	CREATE parrot_db;
	USE parrot_db;

	CREATE TABLE word_table (
  	id INT(6) PRIMARY KEY AUTO_INCREMENT,
  	word VARCHAR(255),
  	reg_date TIMESTAMP);

	CREATE TABLE short_phrase_table (
  	id INT(6) PRIMARY KEY AUTO_INCREMENT,
  	sentence VARCHAR(255),
  	reg_date TIMESTAMP);
  
	CREATE TABLE long_phrase_table (
  	id int(6) PRIMARY KEY AUTO_INCREMENT,
  	sentence VARCHAR(255),
  	reg_date TIMESTAMP);
