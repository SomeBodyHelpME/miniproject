const express = require('express');
const router = express.Router();
const moment = require('moment');
const request = require('request');
const schedule = require('node-schedule');
var dust = require('../models/dust');

const j = schedule.scheduleJob('0 1 * * * *', async() => {
	let time = moment().format("YYYY-MM-DD HH:mm:ss");
	let year = time.substring(0, 4);
  let month = time.substring(5, 7);
  let day = time.substring(8, 10);
  let hour = time.substring(11, 13) - 1;
  if (hour < 0) {
  	day = day - 1;
  	hour = 23;
  }
  if (hour < 10) {
    hour = '0' + hour;
  }
  let minute = '00';
  let date = year + month + day + hour + minute;
  let url = 'http://openAPI.seoul.go.kr:8088/71504a4669646c7437386c46694d4a/json/TimeAverageAirQuality/1/25/' + date;

  request(url, async(err, response, body) => {
  	let data = JSON.parse(body).TimeAverageAirQuality.row;
  	await dust.create(data, async (err, dusts) => {
  		if (err) {
  			console.log('Internal Server Error');
  		} else {
  			
	  		console.log('Success to get Data : ' + date);
	  		
  		}
  	});	// await dust.create
  });	// request

});	// schedule.scheduleJob
