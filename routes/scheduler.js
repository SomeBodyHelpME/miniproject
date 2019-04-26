const express = require('express');
const router = express.Router();
const moment = require('moment');
const request = require('request');
const schedule = require('node-schedule');
const serviceKey = require('../config/serviceKey.js').key;
var dust = require('../models/dust');
var weather = require('../models/weather');

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
  let url = 'http://openAPI.seoul.go.kr:8088/4c736d4442646c743738765455766b/json/TimeAverageAirQuality/1/25/' + date;

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

const j2 = schedule.scheduleJob('5 1 * * * *', async() => {
  let time = moment().format("YYYY-MM-DD HH:mm:ss");
  let year = time.substring(0, 4);
  let month = time.substring(5, 7);
  let day = time.substring(8, 10);
  let hour = time.substring(11, 13);
  if (hour < 2) {
    day = day - 1;
    hour = 23;
  }

  if ((hour + 1) % 3 === 0) {
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
          MSRSTE_NM : "서울특별시" + arr[i],
          Humidity : humidity,
          Temperatures : temperature
        };
        await weather.create(weatherData, async (err, weathers) => {
          if (err) {
            console.log('Internal Server Error');
          } else {
            console.log('Success to get Data : ' + weathers);
          }
        }); // await dust.create
      }); // request
    }
  }
}); // schedule.scheduleJob
