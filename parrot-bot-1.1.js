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
var insult = require("./lib/insult.js")
var compliment = require("./lib/compliment.js")
var trophy = require("./lib/trophies.js")


//______________________________________INITIALIZING THE BOT________________________________________
/*-------- Discord API ------------*/
var Discord = require('discord.js');
var bot = new Discord.Client();
/*---------------------------------*/

/* ------ Bot login Token ------ */
bot.login('MjQ4MzMyNjY2NTI3NTQ3Mzky.CzoNvQ.M4EDmg5SebcgIfxRcjlhRm0etmE');
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
con.connect(function (err) {
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
    var usr = message.author.username;

    var userEntry = {
        username: usr,
        entry: getEntry(msg)
    };

    var value = {
        word: getRandomWord(msg)
    };
    var value2 = {
        sentence: getShortPhrase(msg)
    };
    var value3 = {
        sentence: getLongPhrase(msg)
    };

    if (wordCount.length >= 1) {
        /* Prevents Jeff from entering his own messages into the database */
        if (!msg.includes("!jeff") && (!msg.includes('bawk!') && (!msg[0].includes('!')))) {
            con.query('INSERT INTO users SET ?', userEntry, function (err, res) {
                if (err) throw err;
                console.log('A value was inserted! insert ID:', res.insertId);
            });
        }
    }

    //determining if there was a link in the message
    var regex = /https?:\/\/\S*\.?\S+/g;
    var matchArray = msg.match(regex);
    var foundLink = false;
    if (matchArray) foundLink = true;


    console.log("message length: ", wordCount.length);
    /* Prevents jeff from entering his own messages into the database */
    if (!msg.includes("!jeff") && (!msg.includes('bawk!') && (!msg[0].includes('!')))) {
        //Sort the input into the correct tables
        if (wordCount.length <= 3) {
            con.query('INSERT INTO word_table SET ?', value, function (err, res) {
                if (err) throw err;
                console.log('Last insert to word_table ID:', res.insertId);
            });
        }
        if (wordCount.length >= 3) {
            con.query('INSERT INTO short_phrase_table SET ?', value2, function (err, res) {
                if (err) throw err;
                console.log('Last insert to short_phrase_table ID:', res.insertId);
            });
        }
        if (wordCount.length > 3) {
            con.query('INSERT INTO long_phrase_table SET ?', value3, function (err, res) {
                if (err) throw err;
                console.log('Last insert to long_phrase_table ID:', res.insertId);
            });
        }
        if (foundLink) {
            for (var i = 0; i < matchArray.length; i++) {

                con.query('INSERT INTO links SET link= ' + con.escape(matchArray[i]), function (err, res) {
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
    if (!msg.content.startsWith(prefix)) {
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
        msg.channel.sendMessage('!trophies - Lists all users haiku trophies.')
    }
    /* Makes jeff speak */
    if (msg.content.startsWith(prefix + "jeff")) {
        getMessageParts();
        /* wipe local lists */

    } else if (msg.content.startsWith(prefix + "haiku")) {
        msg.channel.sendMessage(haiku.getHaikuTopic());
        /* wipe local lists */


    } else if (msg.content.startsWith(prefix + "trophies")) {
        msg.channel.sendMessage(trophy.getTrophies());
    } else if (msg.content.startsWith(prefix + "winner")) {

        //do logic
        //need to update the specific column

        var splitMsg = msg.content.split(' ');
        secondWord = splitMsg[1];
        updateTrophies(secondWord);

    } else if (msg.content.startsWith(prefix + "rude")) {

        //msg.channel.sendMessage('hey ' + msg.author.username + '. Fuck you! bawk!');
        //msg.channel.sendMessage('here is the list of channel users: ' + JSON.stringify(msg.channel.members));
        var col = msg.channel.members;
        //console.dir(col);
        //console.log(col.first());

        var usr = col.random().user.username;

        msg.channel.sendMessage('hey ' + usr + ' ' + insult.getInsult() + ' bawk!');


    } else if (msg.content.startsWith(prefix + "nice")) {
        /* wipe local lists */

        /* Generate a compliment from a txt file wordlist */
        var col = msg.channel.members;
        /* retrieve a rnadom username from the chanlle list collection this operation might be expensive */
        var usr = col.random().user.username;
        /* later generate additional ways of forming a valid compliment */
        msg.channel.sendMessage('hey ' + usr + ' ' + compliment.getCompliment() + ' bawk!');
    }
    else if (msg.content.startsWith(prefix + "link")) {
        getLink()
        /* wipe local lists */

    } else {
        return;
    }
});
/* Function that gets the entire msg and puts it in a users SQL table later */
function getEntry(message) {
    var wordList = message.split(' ');
    var entry = '';
    for (var i = 0; i < wordList.length; i++) {
        /* Add the words to the local variable */
        if (wordList[i] != "!jeff") {
            entry += wordList[i];
        }

        /* If it's at the end of the word list do not add extra white space */
        if (i != (wordList.length - 1)) {
            entry += ' ';
        }
    }

    return entry;
}

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
    con.query("SELECT word FROM word_table", function (err, rows) {
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
    con.query("SELECT sentence FROM short_phrase_table", function (err, rows) {
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
    con.query("SELECT sentence FROM long_phrase_table", function (err, rows) {
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
    timer = setInterval(checkQueryResponse, 200);

}
function sendParrotMessage(words, shortPhrases, longPhrases) {
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

function getLink() {
    con.query("SELECT link FROM links ORDER BY RAND() LIMIT 1", function (err, rows) {
        if (err) {
            throw err;
        } else {
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

function checkQueryResponse() {
    /*
    console.log("___________Waiting on queries___________");
    if(wordQ) console.log("words query: complete");
    else console.log("words query: running...");

    if(shortQ) console.log("short_phrase query: complete");
    else console.log("short_phrase query: running...");

    if(longQ) console.log("long_phrase query: complete");
    else console.log("long_phrase query: running...");
    */

    if (wordQ && shortQ && longQ) {
        sendParrotMessage(glob_word, glob_short, glob_long);
        clearInterval(timer);
        timer = null;
    } else {
        console.log("Queries are running...");
    }
}
function updateTrophies(username) {

    /* Basic query on entire table */
    con.query("SELECT * FROM trophies", function (err, rows) {
        if (err) {
            throw err;
        } else {

            usrList = [];
            for (var i = 0; i < rows.length; i++) {
                /* Pushes all users in local array */
                usrList.push(rows[i].username);
            }
            /* If the user already exists we don't want to create a new user we want to update it*/
            if (usrList.includes(username)) {
                console.log('it already exists');
                /*Select all data with the username passed down */
                con.query("SELECT * FROM trophies WHERE username= ?", [username], function (err, rows) {
                    if (err) {

                        throw err;
                    } else {
                        /*Parse data so it can be used more easily */
                        var str = JSON.stringify(rows);
                        var json = JSON.parse(str);
                        /* Get the value of user trophies and store it */
                        var val = json[0].trophy_count;
                        /* Simply adds a new trophy to existing count */
                        val += 1
                        /* Does the query to update mySQL data */
                        con.query('UPDATE trophies SET trophy_count= ? Where username = ?', [val, username],
                            function (err, result) {
                                if (err) throw err;
                                console.log('Changed ' + result.changedRows + ' rows');
                            }
                        );
                    }
                });
            } else {
                /* The username does not already exist in MYSQL so it will create a new entry */
                console.log('it does not exist');

                /* single entry var for username and trophy_count field */
                var entry = {
                    username: username,
                    trophy_count: 1
                };
                /* Put them in the trophies table */
                con.query('INSERT INTO trophies SET ?', entry, function (err, res) {
                    if (err) throw err;
                    console.log('Created a new entry! insert ID:', res.insertId);
                });

            }

        }
    });


}