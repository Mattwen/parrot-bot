/*Parrot-Bot AKA jeff The Parrot 
Created By Matt Wenger */


/* To do 
- Restructure entire bot around MySQL 
- Implement !Haiku and !meme functions
- 

*/

//setting globals because queries must be asynchronous
var timer = null;

var glob_word = [];
var glob_short = [];
var glob_long = [];

var wordQ = false;
var shortQ = false;
var longQ = false;

var haiku = require("./lib/haiku.js");

//______________________________________INITIALIZING THE BOT________________________________________
/*-------- Discord API ------------*/
var Discord = require('discord.js');
var bot = new Discord.Client();
/*---------------------------------*/

/* ------ Bot login Token ------ */
bot.login('MjQ4MzMyNjY2NTI3NTQ3Mzky.CzYwJA.8WrI-KU1wJp4b0nBwsty3v0Pso4');
/* ----------------------------- */

/*----------- MySQL -------------*/
var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "IDONTLikeMemes",
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
    console.log('jeff is ready!');
});


/* listens for any responses */
bot.on('message', (message) => {//______________________HANDLING MESSAGE INPUT_______________________________
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

    var regex = /https?:\/\/\S*\.?\S+/g;
    var matchArray = msg.match(regex);
    var foundLink = false;
    if(matchArray) foundLink = true;


    console.log("message length: ", wordCount.length);
    /* Prevents jeff from entering his own messages into the database */
    if (!msg.includes("!jeff") && (!msg.includes('bawk!') && (!msg[0].includes('!')))) {
        if (wordCount.length <= 3) {    
            con.query('INSERT INTO word_table SET ?', value, function(err, res) {
                if (err) throw err;
                console.log('Last insert to word_table ID:', res.insertId);
            });
        }
        if (wordCount.length >= 3) {
            con.query('INSERT INTO short_phrase_table SET ?', value2, function(err, res) {
                if (err) throw err;
                console.log('Last insert to short_phrase_table ID:', res.insertId);
            });
        }
        if (wordCount.length > 3) {
            con.query('INSERT INTO long_phrase_table SET ?', value3, function(err, res) {
                if (err) throw err;
                console.log('Last insert to long_phrase_table ID:', res.insertId);
            });
        }
        if(foundLink){
            for( var i = 0; i<matchArray.length; i++){
                
                con.query('INSERT INTO links SET link= ' + con.escape(matchArray[i]) , function(err, res) {
                    if (err) throw err;
                    console.log('Last insert to links ID:', res.insertId);
                });
            }
        }
    }
});

/* for ! prefixes */
bot.on("message", msg => { //______________________HANDLING COMMAND INPUT_______________________________

    // Set the prefix
    let prefix = "!";

    // Exit and stop if it's not there
    if (!msg.content.startsWith(prefix)){
        return;
    }

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
    /* Makes jeff speak */
    if (msg.content.startsWith(prefix + "jeff")) {
        getMessageParts();
        /* wipe local lists */

    } else if (msg.content.startsWith(prefix + "haiku")) {
        msg.channel.sendMessage(haiku.getHaikuTopic());
        /* wipe local lists */

    }
    else if (msg.content.startsWith(prefix + "link")) {
        getLink()
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
function getRandomWord(message) { //NOT SURE IF I AGREE WITH THIS, WE SHOULD JUST INSERT EVERY NEW WORD INTO DB

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

//////////////////////////////////////////B O T    F U N C T I O N S //////////////////////////////////////////////////////

/* Needs to pull from MySQL */
function getMessageParts() { //CREATES A SENTENCE FOR THE BOT TO SAY

    //======================running queries===========================

    /* Query for word_table */
    con.query("SELECT word FROM word_table", function(err, rows) {
        if (err) {
            throw err;
        } else {
            var str = JSON.stringify(rows);
            var json = JSON.parse(str);

            for (var i = 0; i < rows.length; i++) {

                //console.log('global: ', glob_word[i].word);
                glob_word.push(json[i].word);
            }
            wordQ = true;
        }
    });

    /* Query for short_phrase_table */
    con.query("SELECT sentence FROM short_phrase_table", function(err, rows) {
        if (err) {
            throw err;
        } else {
            var str = JSON.stringify(rows);
            var json = JSON.parse(str);

            for (var i = 0; i < rows.length; i++) {
                glob_short.push(json[i].sentence);
            }
            shortQ = true;
        }
    });

    /* Query for long_phrase_table */
    con.query("SELECT sentence FROM long_phrase_table", function(err, rows) {
        if (err) {
            throw err;
        } else {
            var str = JSON.stringify(rows);
            var json = JSON.parse(str);

            for (var i = 0; i < rows.length; i++) {
                glob_long.push(json[i].sentence);
            }
            longQ = true;
        }
    });

    //query response feedback
    timer = setInterval(checkQueryResponse,200);

}
function sendParrotMessage(words, shortPhrases, longPhrases ){
    /* [word] [word] [long_phrase] [short_phrase] [word] [word]*/
    var parrot_message = '';

    var additionalWordLength = Math.floor(Math.random() * 3) + 1;
    var additionalWordLength2 = Math.floor(Math.random() * 3) + 1;
    var subPhrase = '';
    var subPhrase2 = '';

    r = Math.floor(Math.random() * 3) + 1;
    /*
    console.log("word phrase list: ", words);
    console.log("short phrase list: ", shortPhrases);
    console.log("long word list: ", longPhrases);
    */
    w = words[Math.floor(Math.random() * words.length)];
    s = shortPhrases[Math.floor(Math.random() * shortPhrases.length)];
    l = longPhrases[Math.floor(Math.random() * longPhrases.length)];

    //constructs a message
    parrot_message += w;
    parrot_message += ' ';
    parrot_message += s;
    parrot_message += ' ';
    parrot_message += l;
    parrot_message += ' ';
    parrot_message += 'bawk!';
    bot.channels.first().sendMessage(parrot_message);
}

function getLink(){
    con.query("SELECT link FROM links ORDER BY RAND() LIMIT 1", function(err, rows) {
        if (err){ 
            throw err;
        } else{
            var str = JSON.stringify(rows);
            var json = JSON.parse(str);
            bot.channels.first().sendMessage(json[0].link);
        }
    });
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

function checkQueryResponse(){
    /*
    console.log("___________Waiting on queries___________");
    if(wordQ) console.log("words query: complete");
    else console.log("words query: running...");

    if(shortQ) console.log("short_phrase query: complete");
    else console.log("short_phrase query: running...");

    if(longQ) console.log("long_phrase query: complete");
    else console.log("long_phrase query: running...");
    */

    if(wordQ && shortQ && longQ){
        sendParrotMessage(glob_word,glob_short,glob_long);
        clearInterval(timer);
        timer = null;
    }else{
        console.log("Queries are running...");
    }
}



