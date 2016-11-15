/*Parrot-Bot AKA Jeff The Parrot 
Created By Matt Wenger */


/* To do 
- Restructure entire bot around MySQL 
- Implement !Haiku and !meme functions
-

*/


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
con.connect(function (err) {
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

// Stores the chat message temporarily to add to MySQL //
var chat_message = {};
var word = [];
var long = [];
var short = [];

/* listens for any responses */
bot.on('message', (message) => {
    msg = message.content;

    /* Prevents Jeff from entering his own messages into the database */
    if (!msg.includes("!jeff") && (!msg.includes('bawk!'))) {
        chat_message = {
            word: getRandomWord(msg),
            long_phrase: getLongPhrase(msg),
            short_phrase: getShortPhrase(msg)
        };
        
        /* inserts responses*/
        con.query('INSERT INTO parrot_table SET ?', chat_message, function (err, res) {
            if (err) throw err;
            console.log('Last insert ID:', res.insertId);
        });
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
        
    } else {
        return;
    }
});

/* Prints and retrieves mySQL data */
con.query('SELECT * FROM parrot_table', function (err, rows) {
    if (err) throw err;

    /* Add all SQL data into temp local data */
    for (var i = 0; i < rows.length; i++) {
        if (rows[i].word != '!jeff') {
            
            /* Push the table data to local memory */
            word.push(rows[i].word);
            long.push(rows[i].long_phrase);
            short.push(rows[i].short_phrase);
        }
    }
})

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
    }
    return longPhrase;
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
    }
    return shortPhrase;
}

/* Gets the word at the given location in a sentence ex. 0 for first word, 1, for second word in sentence .. etc */
function getRandomWord(message) {

    var wordList = message.split(' ');
    var randomWord = '';

    /* Choose a ranom word from the list */
    for (var i = 0; i < wordList.length; i++) {
        if (randomWord[i] != "!jeff") {
            randomWord = wordList[Math.floor(Math.random() * wordList.length)];
        }
    }
    return randomWord;
}

/* Needs to pull from MySQL */
function getParrotMessage() {
    return parrot_message;
}
function getParrotMessage() {

    /* [word] [word] [long_phrase] [short_phrase] [word] [word]*/
    var parrot_message = "";

    var length = Math.floor(Math.random() * 4) + 1;

    /* Get random value from the list */
    w = word[Math.floor(Math.random() * word.length)];
    s = short[Math.floor(Math.random() * short.length)];
    l = long[Math.floor(Math.random() * long.length)];

    // place holder //
    parrot_message += w;
    parrot_message += " ";
    parrot_message += l;
    parrot_message += " ";
    parrot_message += s;
    parrot_message += 'bawk!';
    // fix later //

    return parrot_message;
}