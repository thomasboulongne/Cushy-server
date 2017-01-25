'use strict';
const express = require('express');

const db = require('./db');

const app = express();

const MovieManager = require('./classes/MovieManager');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
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

app.get('/sensor/', (req, res) => {

	const data = db.get('data')
	.sortBy('timestamp')
	.reverse()
	.value();

	let html = "<table><tr><th>id</th><th>timestamp</th><th>data</th></tr>";

	for(let i = 0; i<data.length; i++) {
		const date = new Date(data[i].timestamp);
		html += "<tr>";
		html += "	<td>" + data[i].user_id + "</td>";
		html += "	<td>";
		html += 		("0" + date.getDate()).substr(-2);
		html += 		"/";
		html += 		("0" + (date.getMonth() + 1)).substr(-2);
		html += 		"/";
		html += 		date.getFullYear();
		html += 		" ";
		html += 		("0" + date.getHours()).substr(-2);
		html += 		":";
		html += 		("0" + date.getHours()).substr(-2);
		html += 		":";
		html += 		("0" + date.getSeconds()).substr(-2);
		html += "	</td>";
		html += "	<td>" + data[i].data + "</td>";
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

	MovieManager.getMovies(last_entry)
	.then( response => {
		res.end(JSON.stringify(response));
	})
	.catch( err => {
		console.log(err);
	});

});

app.listen(3637);