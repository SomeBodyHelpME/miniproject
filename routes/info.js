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

router.get(
  /^\/[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?),\s*[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/,
  async (req, res) => {
    try {
      const point = req.url.substring(1);
      let long = point.split(",")[0];
      let lat = point.split(",")[1];

      const regionFullName = await region.findNear(long, lat);

      console.log(regionFullName);
      if (!regionFullName) {
        res.status(400).json({
          msg: point + "은(는) 대한민국 바깥인 것 같아요."
        });
        return;
      }

      const regionName = regionNames.filter(name =>
        regionFullName.includes(name)
      )[0];

      if (typeof regionName === "undefined") {
        res.status(400).json({
          msg: regionFullName + "은(는) 아직 지원하지 않아요."
        });
        return;
      }

      let dustInfo = await dust.search(regionName);
      let weatherInfo = await weather.search(regionName);

      if (!dustInfo && !weatherInfo) {
        res.status(500).send({
          message: "Internal Server Error"
        });
      } else {
        res.status(200).send({
          msg: "Success to Get Data",
          dust: dustInfo,
          weather: weatherInfo
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
);

router.get("/:code", async (req, res) => {
  let code = req.params.code;

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

  let selectdust = await dust.find({
    MSRSTE_NM: regionNames[code],
    MSRDT: date
  });
  let selectweather = await weather.find({
    MSRSTE_NM: regionNames[code],
    MSRDT: base_date + base_time
  });

  if (!selectdust && !selectweather) {
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
