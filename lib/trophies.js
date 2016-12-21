var fs = require('fs');
var trophiesStr = '';

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
    doTrophyQuery();
});
function updateSQL(){
    
}


function setTrophies(value) {
    doTrophyQuery();
    var str = JSON.stringify(value);
    var json = JSON.parse(str);
    trophiesStr = '';
    trophiesStr +='Name | Trophies \n';
    for(var i = 0; i < value.length; i++)
    {
        
        trophiesStr +='----------------------------------- \n';
        trophiesStr+='| '
        trophiesStr +=json[i].username;
        trophiesStr += ' | ';
        trophiesStr +=json[i].trophy_count;
        
        trophiesStr += '\n';
        
    }
    trophiesStr +='----------------------------------- \n';
}

module.exports = {
    getTrophies: function (list) {
        if (trophiesStr != null) {
            return trophiesStr;
        } else {
            return 'error returning trophies';
        }
    
    },
    doTrophyQuery: function (list) {
        doTrophyQuery()
    }
};

function doTrophyQuery() {
    /* Query for trophies */
    con.query("SELECT * FROM trophies ORDER BY trophy_count DESC", function (err, rows) {
        if (err) {
            throw err;
        } else {
            setTrophies(rows);
        }
    });

}

}

