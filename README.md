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
	
	CREATE TABLE users (
	id int(6) PRIMARY KEY AUTO_INCREMENT,
	username VARCHAR(255),
	entry VARCHAR(255),
	date TIMESTAMP);
	
	CREATE TABLE trophies (
	id int(6) PRIMARY KEY AUTO_INCREMENT,
	username VARCHAR(255),
	trophy_count VARCHAR(255),
	date TIMESTAMP);
	
	CREATE TABLE links (
	id int(6) PRIMARY KEY AUTO_INCREMENT,
	link VARCHAR(255),
	date TIMESTAMP);
