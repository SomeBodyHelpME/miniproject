const express = require('express');
const router = express.Router();
const moment = require('moment');
const request = require('request');
const schedule = require('node-schedule');
var dust = require('../models/dust');

router.post('/', async(req, res) => {
	// console.log(req.body.MSRSTE_NM);
	// let selectdust = await dust.find({"MSRSTE_NM" : req.body.MSRSTE_NM});
	let selectdust = await dust.find({});
	res.status(200).send({
		msg : "hi",
		data : selectdust
	})
});

module.exports = router;
