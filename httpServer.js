'use strict';
const express = require('express');

const app = express();

const request = require('request');

app.get('/sensor/:id/:data', (req, res) => {
	let coussflix_id = req.params.id;
	let data = req.params.data;
	
	request('https://coussflix.thomasboulongne.com/sensor/' + coussflix_id + '/' + data, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
		}
	});

	res.end(data);
});

app.listen(3636);