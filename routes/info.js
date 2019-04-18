const express = require('express');
const router = express.Router();
const moment = require('moment');
const request = require('request');
const schedule = require('node-schedule');
var dust = require('../models/dust');
var weather = require('../models/weather');
var statuscode = require('../module/statuscode.js');

router.get('/:lat/:long', async(req, res) => {
  let lat = req.params.lat;
  let long = req.params.long;

  let arr = ['강남구','강동구','강북구','강서구','관악구','광진구','구로구','금천구','노원구','도봉구','동대문구','동작구','마포구','서대문구','서초구','성동구','성북구','송파구','양천구','영등포구','용산구','은평구','종로구','중구','중랑구'];
  let weatherArr = [[61, 126],[62, 126],[61, 128],[58, 126],[59, 125],[62, 126],[58, 125],[59, 124],[61, 129],[61, 129],[61, 127],[59, 125],[59, 127],[59, 127],[61, 125],[61, 127],[61, 127],[62, 126],[58, 126],[58, 126],[60, 126],[59, 127],[60, 127],[60, 127],[62, 128]];


  let result = TEMP.split(' ');
  let code = -1;

  for (let i = 0 ; i < 25 ; i++) {
    if (result[1].endsWith(arr[i])) {
      code = i;
    }
  }

  if (code === -1) {    // 구 정보 잘못 됐다면 
    res.status(500).send({
      message : "Internal Server Error"
    });  
  } else {              // 구 정보 제대로 됐다면 
    let time = moment().format("YYYY-MM-DD HH:mm:ss");
    let year = time.substring(0, 4);
    let month = time.substring(5, 7);
    let dustday = time.substring(8, 10);
    let dusthour = time.substring(11, 13) - 1;
    let minute = '00';

    let weatherday = time.substring(8, 10);
    let weatherhour = time.substring(11, 13);

    if (weatherhour < 2) {
      weatherday = weatherday - 1;
      weatherhour = 23;
    }

    weatherhour = weatherhour - (weatherhour + 1) % 3;
    if (weatherhour < 10) {
      weatherhour = '0' + weatherhour;
    }
    let base_date = year + month + weatherday;
    let base_time = weatherhour + minute;


    if (dusthour < 0) {
      dustday = dustday - 1;
      dusthour = 23;
    }
    if (dusthour < 10) {
      dusthour = '0' + dusthour;
    }
    
    let date = year + month + dustday + dusthour + minute;


  	let selectdust = await dust.find({"MSRSTE_NM" : arr[code], "MSRDT" : date});
    let selectweather = await weather.find({"MSRSTE_NM" : arr[code], "MSRDT" : base_date + base_time});
  	
  	if (!selectdust && !selectweather) {
      res.status(500).send({
        message : "Internal Server Error"
      });
    } else {
      res.status(200).send({
        msg : "Success to Get Data",
        dust : selectdust[0],
        weather : selectweather[0]
      });  
    }
  }
});

module.exports = router;
