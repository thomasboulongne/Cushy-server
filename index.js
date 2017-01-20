'use strict';
const express = require('express');

const db = require('./db');

const app = express();

const MovieManager = require('./classes/MovieManager');

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

app.get('/sensor/', (req, res) => {

	const data = db.get('data')
	.value();

	let html = "<table><tr><th>id</th><th>timestamp</th><th>data</th></tr>";

	for(let i = 0; i<data.length; i++) {
		html += "<tr>";
		html += "<td>" + data[i].user_id + "</td>";
		html += "<td>" + data[i].timestamp + "</td>";
		html += "<td>" + data[i].data + "</td>";
		html += "</tr>";
	}
	
	res.end(html);

});

app.get('/app/:id', (req, res) => {
	let coussflix_id = req.params.id;

	const last_entries = db.get('data')
	.filter({
		user_id: coussflix_id
	})
	.sortBy('timestamp')
	.reverse()
	.take(1)
	.value();
	
	const last_entry = last_entries[0];
	console.log(last_entry);

	MovieManager.getMovies(last_entry);
	res.end(last_entry.data);

});

app.listen(3637);