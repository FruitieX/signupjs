var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.set('views', __dirname);
app.set('view engine', 'jade');

var fs = require('fs');

var dirname = __dirname + '/tournies';

if(!fs.existsSync(dirname))
    fs.mkdirSync(dirname);

app.get('/', function(req, res) {
    res.send('Please provide tourney ID!');
});

app.get('/:tourney', function(req, res) {
    var path = dirname + '/' + req.params.tourney + '.txt';
    var entries = '';

    if(fs.existsSync(path))
        entries = fs.readFileSync(path).toString();

    entries = entries.split('\n');
    entries.pop(); // trailing newline causes empty entry

    res.render('index', { tourney: req.params.tourney, entries: entries });
});

app.post('/:tourney', function(req, res) {
    if(!req.params.tourney || req.params.tourney === '' ||
       !req.body.nick    || req.body.nick === '') {

        res.send('Please provide nick');
        return;
    }

    var path = dirname + '/' + req.params.tourney + '.txt';
    var entries = '';

    if(fs.existsSync(path))
        entries = fs.readFileSync(path).toString();

    fs.writeFileSync(path, req.body.nick + '\n', { flag: 'a' });

    entries += req.body.nick + '\n';
    entries = entries.split('\n');
    entries.pop(); // trailing newline causes empty entry

    res.render('index', { tourney: req.params.tourney, entries: entries });
});

app.listen(process.env.PORT || 8080);
