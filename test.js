var Discord = require('discord.js');
var bot = new Discord.Client();

bot.login('MjQ4MzMyNjY2NTI3NTQ3Mzky.CzoNvQ.M4EDmg5SebcgIfxRcjlhRm0etmE');

var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "IDONTLikeMemes",
    database: "parrot_db"
});

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

bot.on('message', (message) => {//______________________HANDLING MESSAGE INPUT_______________________________
    msg = message.content;

    var usr = message.author.username;
    console.log(usr);
    console.log(message.author.id);
});