var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.set('views', __dirname);
app.set('view engine', 'jade');

var fs = require('fs');
var dirname = __dirname + '/tournies';
if(!fs.existsSync(dirname))
    fs.mkdirSync(dirname);

app.get('/', function(req, res) {
    res.render('usage');
});

var getEntries = function(tourney) {
    var path = dirname + '/' + tourney + '.json';
    var entries = [];

    if(fs.existsSync(path))
        entries = JSON.parse(fs.readFileSync(path).toString());

    return entries;
};

appendEntry = function(tourney, entry) {
    // validate types
    if(entry.team) {
        // 'nicks' must be an array no shorter than two cells
        if (!(entry.nicks instanceof Array) || entry.nicks.length < 2)
            return false;
    } else {
        // 'nick' must be a string
        if(typeof entry.nick !== 'string')
            return false;
    }

    var entries = getEntries(tourney);

    // check if entry exists, based on nick & team property, if so: quit
    for(var i = 0; i < entries.length; i++)
        if((entries[i].nick && entries[i].nick === entry.nick) ||
           (entries[i].team && entries[i].team === entry.team))
            return true;

    // write entry to file
    entries.push(entry);
    fs.writeFileSync(dirname + '/' + tourney + '.json', JSON.stringify(entries));
    return true;
};

app.get('/:tourney', function(req, res) {
    res.json(getEntries(req.params.tourney));
});

app.post('/:tourney', bodyParser.json(), function(req, res) {
    if(appendEntry(req.params.tourney, req.body)) {
        res.send('Signup completed');
    } else {
        res.status(400).send('Signup failed. Check "/" for usage instructions');
    }
});

app.listen(process.env.PORT || 8080);
