
var data = [];

var Discord = require('discord.js');
var bot = new Discord.Client();


/* Intialize blank message array for storing messages */


var storedMessages = [];
var phraseBank = [];

var wordbank1 = [];
var wordbank2 = [];
var wordbank3 = [];

var author = "";

/* Turns on bot, ready for listening. */
bot.on('ready', () => {
  console.log('I am ready!');
});

/* responses */
var responseObject = {
  "ayy": "BAWK! Ayy, lmao BAWK!",
  "wat": "Say what?",
  "lol": "BAWK!, lol",
  "Ben":"BAWK, I like Mario!"
};

/* listens for any responses */
bot.on('message', (message) => {
    msg = message.content;
    
    /*console.log(storeWords(msg));
    console.log(storedMessages)
    console.log(msg)*/
    splitAndStore(msg);
    //console.log(splitAndStore(msg))
    setUser(author);
    console.log("all messages: ", storedMessages);
    console.log("all phrases: ", phraseBank);


  if(responseObject[msg]) {
    message.channel.sendMessage(responseObject[msg]);
  }
});


/* for ! prefixes */
bot.on("message", msg => {

  // Set the prefix
  let prefix = "!";
  
  // Exit and stop if it's not there
  if(!msg.content.startsWith(prefix)) return;

  /* If anyone in any chat types !help, will print multi line command list */
  if (msg.content.startsWith(prefix + "help")) {
    msg.channel.sendMessage("Here is a list of valid commands: ");
    msg.channel.sendMessage("----------------------------------");
    msg.channel.sendMessage("!meme - Creates a meme.");
    msg.channel.sendMessage("!rude - Insults a random user in the channel.");
    msg.channel.sendMessage("!nice - Compliment a random user in the channel.");
    msg.channel.sendMessage("!haiku - Generates a random topic for haiku channel.");
    msg.channel.sendMessage("!jeff - Spew out a message generated from previous channel messages.")
  } 
  if(msg.content.startsWith(prefix + "jeff")){
      msg.channel.sendMessage(getParrotMessage());
      
  }

  /* ignore */
  else if (msg.content.startsWith(prefix + "foo")) {
    msg.channel.sendMessage("bar!");
  }
});

/* Bot login Token */
bot.login('MjQ2ODcxMzAyNzAxMzE4MTU1.Cwg9AQ.h0Jzd3AhxSI3ctF8ivz-fRjZvdU');

var teststr = 'hey all you kids';

function setUser(user)
{
    author = user;
}


/* Retrieves the first word of the message */
function getFirstWord(str){
    if(str.indexOf(' ') === -1){
        return str;
    }
    else{
        return str.substring(0, str.indexOf(' '));
    }
}

/* Gets the word at the given location in a sentence ex. 0 for first word, 1, for second word in sentence .. etc */
function getWordAtLocation(str, location){
    
    var words = str.split(' ');

    return words[location];
    
}
console.log(getWordAtLocation(teststr, 0));

/* Stores a list of words for later use. Pushes to StoredMessages arrays */
function storeWords(sentence){
    
    var targetWord = '';
    var split = sentence.split(' ');
    console.log("length: ", split.length);
    storedMessages.push(targetWord);
    
    /* store every word */
    for(var i =0; i < split.length; i++){
        targetWord = getWordAtLocation(sentence, i)

        storedMessages.push(targetWord);
        
    } 
    
}

function splitAndStore(sentence){
    var wordlist = sentence.split(' ');

    console.log(wordlist);

    console.log(wordlist.length);
    var phrase = "";
    /* please add everything for the love of god */
    for(var i = 0; i < wordlist.length; i++){
        if (getWordAtLocation(sentence, i) !== '!jeff'){
            
            storedMessages.push(getWordAtLocation(sentence, i));
        }
        if(getWordAtLocation(sentence, i) !== '!jeff' && wordlist.length >= 3)
        {

            phrase += getWordAtLocation(sentence, i)
            phrase += " ";
            
            
        }
        else{

        }
        
        
    }
    
    /* If the phrase is not blank and not said by a bot, push it */
    console.log("right here: ", author);
    console.log("is a bot: ? ", author.bot); 
    if(phrase != '' && !phrase.includes("BAWK!"))
    {
        phraseBank.push(phrase);
        
    }
    
    
    /* If the sentence contains at least 1 word*/
    if (wordlist.length >= 1 && sentence !== '!jeff'){

        var targetWord = getWordAtLocation(sentence, 0)
        
        /* Prevents duplicate words from being stored */
        if (wordbank1.indexOf(targetWord) > -1) {
            //In the array!

        } else {
            //Not in the array
            
            wordbank1.push(getWordAtLocation(sentence, 0));
        }  
        
    }
    /* --------------------------------------------------------- */
    /* If the sentence contains at least 2 words */
    if(wordlist.length >= 2 ){
        var targetWord = getWordAtLocation(sentence, 1)
        
        /* Prevents duplicate words from being stored */
        if (wordbank2.indexOf(targetWord) > -1) {
            //In the array!

        } else {
            //Not in the array
            
            wordbank2.push(getWordAtLocation(sentence, 1));
        } 
    }
    /* --------------------------------------------------------- */
    /* If the sentence contains at least 3 words */
    if(wordlist.length >= 3){
        var targetWord = getWordAtLocation(sentence, 2)
        
        /* Prevents duplicate words from being stored */
        if (wordbank3.indexOf(targetWord) > -1) {
            //In the array!

        } else {
            //Not in the array
            
            wordbank3.push(getWordAtLocation(sentence, 2));
        } 
    }
    /* --------------------------------------------------------- */
    else{
        /* Do nothing for now */
    }
}

/* Executes !jeff command which spews out previously learned words */
function getParrotMessage(){
    var sentence = "";
    
    var length = Math.floor(Math.random() * 10) + 1; 
    var m = '';

    for(var i = 0; i < length; i++){
        console.log(m);
        
        p = phraseBank[Math.floor(Math.random() * phraseBank.length)];
        m = storedMessages[Math.floor(Math.random() * storedMessages.length)];
        
        if (sentence.includes(m)){
            m = storedMessages[Math.floor(Math.random() * storedMessages.length)];
        }
        else{
            m += " ";
            sentence += m;
        }
    }
    sentence += p;
    sentence += "BAWK!";
    

    console.log("sentence: ", sentence);
    return sentence;
}

