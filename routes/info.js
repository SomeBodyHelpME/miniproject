const express = require('express');
const router = express.Router();
const moment = require('moment');
const request = require('request');
const schedule = require('node-schedule');
var dust = require('../models/dust');
var statuscode = require('../module/statuscode.js');

router.get('/:code', async(req, res) => {
	let code = req.params.code;

  let arr = ['강남구','강동구','강북구','강서구','관악구','광진구','구로구','금천구','노원구','도봉구','동대문구','동작구','마포구','서대문구','서초구','성동구','성북구','송파구','양천구','영등포구','용산구','은평구','종로구','중구','중랑구'];

  console.log(code);
  console.log(arr[code]);

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
	let selectdust = await dust.find({"MSRSTE_NM" : arr[code], "MSRDT" : date});
	// let selectdust = await dust.find({});
	if (!selectdust) {
    res.status(500).send({
      message : "Internal Server Error"
    });
  } else {
    res.status(200).send({
      msg : "Success to Get Data",
      data : selectdust
    });  
  }
});

module.exports = router;
