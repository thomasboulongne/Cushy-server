'use strict';
const express = require('express');
const low = require('lowdb');

const db = low('./data/data.json');

ctf.getSpace()
.then( data => {
	const space = data	

	const app = express();

	app.get('/', (req, res) => {
	    res.setHeader('Content-Type', 'text/plain');
	    console.log(`hey adele it's me from the other side`);
	    res.end('Vous êtes à l\'accueil');
	});

	app.get('/sensor/:id/:data', (req, res) => {
		let coussflix_id = req.params.id;
		let data = req.params.data;

		db.get('data')
		.insert({
			user_id: coussflix_id,
			data: data,
			timestamp: Date.now()
		})
		.value();
		
		res.end(data);

	});

	app.listen(3637);
});