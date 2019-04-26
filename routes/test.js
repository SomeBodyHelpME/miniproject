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

// router.get('/test2', async (req, res) => {
//   let time = moment().format("YYYY-MM-DD HH:mm:ss");
//   let year = time.substring(0, 4);
//   let month = time.substring(5, 7);
//   let day = time.substring(8, 10);
//   let hour = time.substring(11, 13) - 1;
//   if (hour < 0) {
//     day = day - 1;
//     hour = 23;
//   }
//   if (hour < 10) {
//     hour = '0' + hour;
//   }
//   let minute = '00';
//   let date = year + month + day + hour + minute;
//   let url = 'http://openAPI.seoul.go.kr:8088/4c736d4442646c743738765455766b/json/TimeAverageAirQuality/1/25/' + date;

//   request(url, async(err, response, body) => {
//     let data = JSON.parse(body).TimeAverageAirQuality.row;
//     await dust.create(data, async (err, dusts) => {
//       if (err) {
//         console.log('Internal Server Error');
//       } else {
        
//         console.log('Success to get Data : ' + date);
        
//       }
//     }); // await dust.create
//   }); // request
// });

router.get('/jeonguk/:numOfRows/:pageNo/:code', async (req, res) => {
  let arr = ["서울", "부산", "대구", "인천", "광주", "대전", "울산", "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주", "세종"];
  var url = 'http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty';
  var queryParams = '?' + encodeURIComponent('ServiceKey') + '=tFt7C734jtD43z7fD4fnZqyagQ6X2VATN3%2Bi8yqSq%2FQGOgEfxH20fCJnnBLyRWB3wGAnchPTriJjwEw8lJ9TuA%3D%3D'; /* Service Key*/
  queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent(req.params.numOfRows); /* 한 페이지 결과 수 */
  queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent(req.params.pageNo); /* 페이지 번호 */
  queryParams += '&' + encodeURIComponent('sidoName') + '=' + encodeURIComponent(arr[req.params.code]); /* 시도 이름 (서울, 부산, 대구, 인천, 광주, 대전, 울산, 경기, 강원, 충북, 충남, 전북, 전남, 경북, 경남, 제주, 세종) */
  queryParams += '&' + encodeURIComponent('ver') + '=' + encodeURIComponent('1.3'); /* 버전별 상세 결과 참고문서 참조 */

  console.log(url + queryParams);
  request({
      url: url + queryParams,
      method: 'GET'
  }, function (error, response, body) {
    res.status(200).send({
      Status : response.statusCode,
      Headers : JSON.stringify(response.headers),
      Response : body
    });
      // console.log('Status', response.statusCode);
      // console.log('Headers', JSON.stringify(response.headers));
      // console.log('Reponse received', body);
  });
});

router.get('/jeonguk2/:numOfRows/:pageNo/:code', async (req, res) => {
  let arr = ["서울", "부산", "대구", "인천", "광주", "대전", "울산", "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주", "세종"];
  var url = 'http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getCtprvnMesureSidoLIst';
  var queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + serviceKey; /* Service Key*/
  queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent(req.params.numOfRows); /* 한 페이지 결과 수 */
  queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent(req.params.pageNo); /* 페이지 번호 */
  queryParams += '&' + encodeURIComponent('sidoName') + '=' + encodeURIComponent(arr[req.params.code]); /* 시도 이름 (서울, 부산, 대구, 인천, 광주, 대전, 울산, 경기, 강원, 충북, 충남, 전북, 전남, 경북, 경남, 제주, 세종) */
  queryParams += '&' + encodeURIComponent('searchCondition') + '=' + encodeURIComponent('HOUR'); /* 요청 데이터기간 (시간 : HOUR, 하루 : DAILY) */
  queryParams += '&_returnType=json';


  console.log(url + queryParams);
  request({
      url: url + queryParams,
      method: 'GET'
  }, function (error, response, body) {
    
   
      
      console.log('Reponse received', JSON.parse(body).list);
  });
});

router.get('/test2', async (req, res) => {
  let arr = ["서울", "부산", "대구", "인천", "광주", "대전", "울산", "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주", "세종"];



  for (let i = 0 ; i < arr.length ; i++) {


    var url = 'http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getCtprvnMesureSidoLIst';
    var queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + serviceKey; /* Service Key*/
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent(40); /* 한 페이지 결과 수 */
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent(1); /* 페이지 번호 */
    queryParams += '&' + encodeURIComponent('searchCondition') + '=' + encodeURIComponent('HOUR'); /* 요청 데이터기간 (시간 : HOUR, 하루 : DAILY) */
    queryParams += '&' + encodeURIComponent('sidoName') + '=' + encodeURIComponent(arr[i]);
    queryParams += '&_returnType=json';

    console.log(url + queryParams);
    
    request({
        url: url + queryParams,
        method: 'GET'
    }, async function (error, response, body) {
      let dataArr = JSON.parse(body).list;
      let data = [];
      console.log(dataArr);
      // for (let j = 0 ; j < dataArr.length ; j++) {
      //   data.push({
      //     MSRDT : dataArr[j].dataTime,
      //     MSRSTE_NM : dataArr[j].sidoName + ' ' + dataArr[j].cityName,
      //     NO2 : dataArr[j].no2Value,
      //     O3 : dataArr[j].o3Value,
      //     CO : dataArr[j].coValue,
      //     SO2 : dataArr[j].so2Value,
      //     PM10 : dataArr[j].pm10Value,
      //     PM25 : dataArr[j].pm25Value
      //   });
      // }
      // console.log(data);
      // res.status(200).send({
      //   message : "Success"
      // });
      // await dust.create(data, async (err, dusts) => {
      //   if (err) {
      //     console.log('Internal Server Error');
      //   } else {
      //     console.log('Success to get Data : ' + arr[i]);      
      //   }
      // }); // await dust.create
    });

    
  }
  
});

router.get('/test3', async (req, res) => {
  let dustInfo = await dust.find({"MSRSTE_NM" : moment().format("YYYY-MM-DD HH:00")});

  res.status(200).send({
    data : dustInfo
  });
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
