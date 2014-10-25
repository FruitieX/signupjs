var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
    next();
});
app.set('views', __dirname);
app.set('view engine', 'jade');

var fs = require('fs');
var dirname = __dirname + '/tournies';
if(!fs.existsSync(dirname))
    fs.mkdirSync(dirname);

var getEntries = function(tourney) {
    var path = dirname + '/' + tourney + '.json';
    var entries = [];

    if(fs.existsSync(path))
        entries = JSON.parse(fs.readFileSync(path).toString());

    return entries;
};

var sanitizeRE = new RegExp('(^\\s+)|(\\s+$)', 'g');
var sanitizeName = function(name) {
    if(typeof name !== 'string')
        return false;

    name = name.replace(sanitizeRE, '');
    name = name.substring(0, 32);
    return name;
};

var checkName = function(name) {
    if(!name || !name.length)
        return false;
    return true;
}

var appendEntry = function(tourney, entry) {
    // validate types
    if(entry.team) {
        entry.team = sanitizeName(entry.team);
        if(!checkName(entry.team))
            return false;

        // 'nicks' must be an array no shorter than two cells
        if (!(entry.nicks instanceof Array) || entry.nicks.length < 2)
            return false;

        for(var i = 0; i < entry.nicks.length; i++) {
            entry.nicks[i] = sanitizeName(entry.nicks[i]);
            if(!checkName(entry.nicks[i]))
                return false;
        }
    } else {
        entry.nick = sanitizeName(entry.nick);
        if(!checkName(entry.nick))
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
    console.log('tourney ' + tourney + ' got registration ' + JSON.stringify(entry));
    return true;
};

app.get('/:tourney', function(req, res) {
    res.json(getEntries(req.params.tourney));
});
app.post('/:tourney', bodyParser.json(), function(req, res) {
    if(appendEntry(req.params.tourney, req.body)) {
        res.send('Signup completed');
    } else {
        console.log('tourney ' + req.params.tourney + ': denying bad registration ' + JSON.stringify(req.body));
        res.status(400).send('Signup failed. Check "/" for usage instructions');
    }
});
app.get('/', function(req, res) {
    res.render('usage');
});

app.listen(process.env.PORT || 8080);
