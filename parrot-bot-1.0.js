/*Parrot-Bot AKA Jeff The Parrot 
Created By Matt Wenger */


/* To do 
- Restructure entire bot around MySQL 
- Implement !Haiku and !meme functions
-

*/

var glob_word = [];
var glob_long = [];
var glob_short = [];


var haiku = require("./lib/haiku.js");

/*-------- Discord API ------------*/
var Discord = require('discord.js');
var bot = new Discord.Client();
/*---------------------------------*/

/* ------ Bot login Token ------ */
bot.login('MjQ2ODcxMzAyNzAxMzE4MTU1.Cwg9AQ.h0Jzd3AhxSI3ctF8ivz-fRjZvdU');
/* ----------------------------- */

/*----------- MySQL -------------*/
var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mattwen-773175",
    database: "parrot_db"
});
/*--------------------------------*/

/* Establish a connection */
con.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + con.threadId);
});

/* Turns on bot, ready for listening. */
bot.on('ready', () => {
    console.log('Jeff is ready!');
});


/* listens for any responses */
bot.on('message', (message) => {
    msg = message.content;

    wordCount = msg.split(' ');

    var value = {
        word: getRandomWord(msg)
    };
    var value2 = {
        sentence: getShortPhrase(msg)
    };
    var value3 = {
        sentence: getLongPhrase(msg)
    };


    console.log("message length: ", wordCount.length);
    if (wordCount.length <= 3) {
        /* Prevents Jeff from entering his own messages into the database */
        if (!msg.includes("!jeff") && (!msg.includes('bawk!') && (!msg[0].includes('!')))) {
            con.query('INSERT INTO word_table SET ?', value, function(err, res) {
                if (err) throw err;
                console.log('Last insert ID:', res.insertId);
            });
        }
    }
    if (wordCount.length >= 3) {
        /* Prevents Jeff from entering his own messages into the database */
        if (!msg.includes("!jeff") && (!msg.includes('bawk!') && (!msg[0].includes('!')))) {
            con.query('INSERT INTO short_phrase_table SET ?', value2, function(err, res) {
                if (err) throw err;
                console.log('Last insert ID:', res.insertId);
            });
        }
    }
    if (wordCount.length > 3) {
        if (!msg.includes("!jeff") && (!msg.includes('bawk!') && (!msg[0].includes('!')))) {
            con.query('INSERT INTO long_phrase_table SET ?', value3, function(err, res) {
                if (err) throw err;
                console.log('Last insert ID:', res.insertId);
            });
        }
    }
});

/* for ! prefixes */
bot.on("message", msg => {

    // Set the prefix
    let prefix = "!";

    // Exit and stop if it's not there
    if (!msg.content.startsWith(prefix)) return;

    /* If anyone in any chat types !help, will print multi line command list */
    if (msg.content.startsWith(prefix + "help")) {
        msg.channel.sendMessage("Here is a list of valid commands: ");
        msg.channel.sendMessage("----------------------------------");
        msg.channel.sendMessage("!meme - Creates a meme.");
        msg.channel.sendMessage("!rude - Insults a random user in the channel.");
        msg.channel.sendMessage("!nice - Compliment a random user in the channel.");
        msg.channel.sendMessage("!haiku - Generates a random topic for haiku channel.");
        msg.channel.sendMessage("!jeff - Spew out a message generated from previous channel messages.");
    }
    /* Makes Jeff speak */
    if (msg.content.startsWith(prefix + "jeff")) {
        msg.channel.sendMessage(getParrotMessage());
        /* wipe local lists */
        doQueries();



    } else if (msg.content.startsWith(prefix + "haiku")) {
        msg.channel.sendMessage(haiku.getHaikuTopic());
        /* wipe local lists */

    } else {
        return;
    }
});

/* Preps the message for long phrase SQL entry */
function getLongPhrase(message) {
    var wordList = message.split(' ');

    /* 4 or more words next to each other*/
    var longPhrase = '';
    if (wordList.length > 3) {
        for (var i = 0; i < wordList.length; i++) {

            /* Add the words to the local variable */
            if (wordList[i] != "!jeff") {
                longPhrase += wordList[i];
            }

            /* If it's at the end of the word list do not add extra white space */
            if (i != (wordList.length - 1)) {
                longPhrase += ' ';
            }
        }
        return longPhrase;
    }
}

/* Preps the message for short phrase SQL entry */
function getShortPhrase(message) {
    var wordList = message.split(' ');

    /* 2 - 3 words next to each other*/
    var shortPhrase = '';

    /* Go through the first three words and add them to shortPhrase */
    if (wordList.length >= 3) {
        for (var i = 0; i < 3; i++) {
            /* Add the words to the local variable */
            if (wordList[i] != "!jeff") {
                shortPhrase += wordList[i];
            }

            /* If it's at the end of the word list do not add extra white space */
            if (i != (wordList.length - 1)) {
                shortPhrase += ' ';
            }
        }
        return shortPhrase;
    }
}

/* Gets the word at the given location in a sentence ex. 0 for first word, 1, for second word in sentence .. etc */
function getRandomWord(message) {

    var wordList = message.split(' ');
    var randomWord = '';

    /* Choose a random word from the list */
    for (var i = 0; i < wordList.length; i++) {
        if (randomWord[i] != "!jeff") {
            randomWord = wordList[Math.floor(Math.random() * wordList.length)];
        }
    }
    return randomWord;
}

function doQueries() {

    /* Query for word_table */
    con.query("SELECT * FROM word_table", function(err, rows) {
        if (err) {
            throw err;
        } else {
            console.log("Are rows being updated?", rows);
            setSQLWord(rows);
        }
    });

    /* Query for long_phrase_table */
    con.query("SELECT * FROM long_phrase_table", function(err, rows) {
        if (err) {
            throw err;
        } else {

            setSQLLong(rows);
        }
    });
    /* Query for short_phrase_table */
    con.query("SELECT * FROM short_phrase_table", function(err, rows) {
        if (err) {
            throw err;
        } else {
            setSQLShort(rows);
        }
    });
}
/* Needs to pull from MySQL */
function getParrotMessage() {

    /* [word] [word] [long_phrase] [short_phrase] [word] [word]*/
    var parrot_message = '';

    var additionalWordLength = Math.floor(Math.random() * 3) + 1;
    var additionalWordLength2 = Math.floor(Math.random() * 3) + 1;
    var subPhrase = '';
    var subPhrase2 = '';




    //r = Math.floor(Math.random() * 3) + 1;
    // word list


    //console.log("word list: ", wordList);


    r = Math.floor(Math.random() * 3) + 1;


    // short word list


    console.log("word phrase list: ", glob_word);
    console.log("short phrase list: ", glob_short);
    console.log("long word list: ", glob_long);

    w = glob_word[Math.floor(Math.random() * glob_word.length)];
    l = glob_long[Math.floor(Math.random() * glob_long.length)];
    s = glob_short[Math.floor(Math.random() * glob_short.length)];

    //constructs a message
    parrot_message += w;
    parrot_message += ' ';
    parrot_message += s;
    parrot_message += ' ';
    parrot_message += l;
    parrot_message += ' ';
    parrot_message += 'bawk!';
    return parrot_message;
}
function setSQLWord(value) {


    var str = JSON.stringify(value);
    var json = JSON.parse(str);

    for (var i = 0; i < value.length; i++) {

        //console.log('global: ', glob_word[i].word);
        glob_word.push(json[i].word);
    }
}

function setSQLLong(value) {

    var str = JSON.stringify(value);
    var json = JSON.parse(str);

    // long word list

    for (var i = 0; i < value.length; i++) {

        glob_long.push(json[i].sentence);
    }
}
function setSQLShort(value) {

    var str = JSON.stringify(value);
    var json = JSON.parse(str);

    for (var i = 0; i < value.length; i++) {

        glob_short.push(json[i].sentence);
    }
}








