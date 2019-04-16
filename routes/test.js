const express = require('express');
const router = express.Router();
const moment = require('moment');
const request = require('request');
const schedule = require('node-schedule');
var dust = require('../models/dust');
var weather = require('../models/weather');
const serviceKey = require('../config/serviceKey.js').key;
router.post('/', async(req, res) => {
	// console.log(req.body.MSRSTE_NM);
	// let selectdust = await dust.find({"MSRSTE_NM" : req.body.MSRSTE_NM});
  let weatherArr = [[61, 126],[62, 126],[61, 128],[58, 126],[59, 125],[62, 126],[58, 125],[59, 124],[61, 129],[61, 129],[61, 127],[59, 125],[59, 127],[59, 127],[61, 125],[61, 127],[61, 127],[62, 126],[58, 126],[58, 126],[60, 126],[59, 127],[60, 127],[60, 127],[62, 128]];

  for (let i = 0 ; i < 25 ; i++) {
    console.log(weatherArr[i][0] + " " + weatherArr[i][1]);
  }
	let selectdust = await dust.find({});
	res.status(200).send({
		msg : "hi",
		data : selectdust
	})
});

router.get('/test', async (req, res) => {

  let time = moment().format("YYYY-MM-DD HH:mm:ss");
  let year = time.substring(0, 4);
  let month = time.substring(5, 7);
  let day = time.substring(8, 10);
  let hour = time.substring(11, 13);
  if (hour < 2) {
    day = day - 1;
    hour = 23;
  }
  hour = hour - (hour + 1) % 3;
  if (hour < 10) {
    hour = '0' + hour;
  }
  let minute = '00';
  let base_date = year + month + day;
  let base_time = hour + minute;
  let weatherArr = [[61, 126],[62, 126],[61, 128],[58, 126],[59, 125],[62, 126],[58, 125],[59, 124],[61, 129],[61, 129],[61, 127],[59, 125],[59, 127],[59, 127],[61, 125],[61, 127],[61, 127],[62, 126],[58, 126],[58, 126],[60, 126],[59, 127],[60, 127],[60, 127],[62, 128]];
  let arr = ['강남구','강동구','강북구','강서구','관악구','광진구','구로구','금천구','노원구','도봉구','동대문구','동작구','마포구','서대문구','서초구','성동구','성북구','송파구','양천구','영등포구','용산구','은평구','종로구','중구','중랑구'];
  for (let i = 0 ; i < 25 ; i++) {

    let url = 'http://newsky2.kma.go.kr/service/SecndSrtpdFrcstInfoService2/ForecastSpaceData?ServiceKey=' + serviceKey + '&base_date=' + base_date + '&base_time=' + base_time + '&nx=' + weatherArr[i][0] + '&ny=' + weatherArr[i][1] + '&_type=json';
    let humidity = 0;
    let temperature = 0;
    request(url, async(err, response, body) => {
      let data = JSON.parse(body).response.body.items.item;
      
      for (let j = 0 ; j < data.length ; j++) {
        if (data[j].category === 'REH') {  // 습도
          console.log('Humidity = ' + data[j].fcstValue);
          humidity = data[j].fcstValue;
        } else if (data[j].category === 'T3H') {
          console.log('Temperature = ' + data[j].fcstValue);
          temperature = data[j].fcstValue;
        }

      }

      let weatherData = {
          MSRDT : base_date + base_time,
          MSRSTE_NM : arr[i],
          Humidity : humidity,
          Temperatures : temperature
      };
      await weather.create(weatherData, async (err, weathers) => {
        if (err) {
          console.log('Internal Server Error');
        } else {
          console.log('Success to get Weather Data : ' + weathers);
          
        }
      }); // await dust.create
    }); // request
  }
});

module.exports = router;
