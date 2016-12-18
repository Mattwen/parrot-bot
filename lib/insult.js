var fs = require('fs');


module.exports = {
    getInsult: function (list) {
        
        var wordList = fs.readFileSync('./lib/insults.txt').toString().split("\n");
        
        var insult = "";
        w = wordList[Math.floor(Math.random() * wordList.length)];
        
        insult+=w
        return insult;
    }
};
