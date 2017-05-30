var express = require('express');
var bodyParser = require('body-parser');
var elasticsearch = require('elasticsearch');
var path = require('path');

var natural = require('natural');
var tokenizer = new natural.WordTokenizer();

var base_folder = path.join(path.dirname(require.resolve("natural")), "brill_pos_tagger");
var rulesFilename = base_folder + "/data/English/tr_from_posjs.txt";
var lexiconFilename = base_folder + "/data/English/lexicon_from_posjs.json";
var defaultCategory = 'N';

var lexicon = new natural.Lexicon(lexiconFilename, defaultCategory);
var rules = new natural.RuleSet(rulesFilename);
var tagger = new natural.BrillPOSTagger(lexicon, rules);

var server = express();

server.use(bodyParser.json());

server.use(express.static(__dirname + '/public'));

server.get('/', function (req, res) {
    // res.send('Hello World');
    res.sendFile(path.join(__dirname + '/index.html'));
});

server.post('/analyze', function (req, res) {

    var wrapData = function (tokens, posTags, stems) {
        return {
            "tokens": tokens,
            "posTags": posTags,
            "stems": stems
        };
    };

    var tokens = [];
    var posTags = [];
    var stems = [];
    // var spellcheck = [];

    if (req.body && req.body['text']) {
        text = req.body['text'];
        tokens = tokenizer.tokenize(text);
        stems = [];
        // spellcheck = new natural.Spellcheck();

        for (t in tokens) {
            stems.push(natural.PorterStemmer.stem(tokens[t]));
        }

        posTags = tagger.tag(tokens);
    } else {
        console.log('got nothing :/');
    }

    res.send(wrapData(tokens, posTags, stems));
});

server.listen(4000);