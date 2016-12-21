var fs = require('fs');


module.exports = {
    getCompliment: function (list) {
        
        var wordList = fs.readFileSync('./lib/compliments.txt').toString().split("\n");
        
        var comp = "";
        w = wordList[Math.floor(Math.random() * wordList.length)];
        
        comp+=w
        return comp;
    }
};