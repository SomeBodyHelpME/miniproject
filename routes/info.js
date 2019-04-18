const express = require("express");
const router = express.Router();
const moment = require("moment");
const request = require("request");
const schedule = require("node-schedule");
const region = require("../models/region");
var dust = require("../models/dust");
var weather = require("../models/weather");
var statuscode = require("../module/statuscode.js");

const regionNames = [
  "강남구",
  "강동구",
  "강북구",
  "강서구",
  "관악구",
  "광진구",
  "구로구",
  "금천구",
  "노원구",
  "도봉구",
  "동대문구",
  "동작구",
  "마포구",
  "서대문구",
  "서초구",
  "성동구",
  "성북구",
  "송파구",
  "양천구",
  "영등포구",
  "용산구",
  "은평구",
  "종로구",
  "중구",
  "중랑구"
];

router.get(/^\/[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/, async (req, res) => {
  let long = req.url.split(",")[0];
  let lat = req.url.split(",")[1];

  const regionFullName = await region.near(long, lat);

  if (!regionFullName) {
    res.sendStatus(400);
  }

  const regionName = regionNames.filter(regionFullName.includes)[0];

  if (typeof (regionName) === 'undefined') {
    res.sendStatus(400);
  }

  let time = moment().format("YYYY-MM-DD HH:mm:ss");
  let year = time.substring(0, 4);
  let month = time.substring(5, 7);
  let dustday = time.substring(8, 10);
  let dusthour = time.substring(11, 13) - 1;
  let minute = "00";

  let weatherday = time.substring(8, 10);
  let weatherhour = time.substring(11, 13);

  if (weatherhour < 2) {
    weatherday = weatherday - 1;
    weatherhour = 23;
  }

  weatherhour = weatherhour - ((weatherhour + 1) % 3);
  if (weatherhour < 10) {
    weatherhour = "0" + weatherhour;
  }
  let base_date = year + month + weatherday;
  let base_time = weatherhour + minute;

  if (dusthour < 0) {
    dustday = dustday - 1;
    dusthour = 23;
  }
  if (dusthour < 10) {
    dusthour = "0" + dusthour;
  }

  let date = year + month + dustday + dusthour + minute;

  let selectdust = await dust.find({ MSRSTE_NM: regionName, MSRDT: date });
  let selectweather = await weather.find({
    MSRSTE_NM: regionName,
    MSRDT: base_date + base_time
  });

  if (selectdust.length === 0 && selectweather.length === 0) {
    res.status(500).send({
      message: "Internal Server Error"
    });
  } else {
    res.status(200).send({
      msg: "Success to Get Data",
      dust: selectdust[0],
      weather: selectweather[0]
    });
  }
});

module.exports = router;
