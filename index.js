var express = require('express');
var ctf = require('./data/contenful.js');

var app = express();

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    console.log(`hey adele it's me from the other side`);
    res.end('Vous êtes à l\'accueil');
});

app.get('/sensor/:id/:data', (req, res) => {
	let id = req.params.id;
	let data = req.params.data;
	
	res.end(data);
});

app.listen(3637);