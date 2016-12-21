var fs = require('fs');


module.exports = {
    getHaikuTopic: function (list) {
        
        var wordList = fs.readFileSync('./lib/nouns.txt').toString().split("\n");
        
        var topicStr = "";
        w = wordList[Math.floor(Math.random() * wordList.length)];
        
        topicStr+= "Here is your Haiku Topic! bawk! \n";
        topicStr+= "-----------------------------\n";
        topicStr+="                 "
        topicStr+=w
        topicStr+='\n'
        topicStr+= "-----------------------------\n";
        topicStr+='Declare you winner with !winner <name>';
        return topicStr;
    }
};







