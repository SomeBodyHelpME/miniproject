const express = require("express");
const router = express.Router();
const Region = require("../models/region");
const Dust = require("../models/dust");
const Weather = require("../models/weather");

router.get("/", async (req, res) => {
  const { keyword } = req.query;

  if (typeof keyword === "undefined") {
    res.status(400).json({
      msg: "검색 키워드를 입력해주세요."
    });
    return;
  }

  Region.findAllByRegionName(keyword)
    .then(regions => {
      res.status(200).json({
        data: regions.map(region => region.toDto())
      });
    })
    .catch(err => {
      res.status(500).json({
        msg: err.message
      });
    });
});

router.get("/:regionId/info", async (req, res) => {
  const regionId = req.params.regionId;

  if (regionId.length !== 24) {
    res.status(400).json({ msg: "ObjectId가 아니네." });
    return;
  }
  const region = await Region.findById(regionId);

  if (region === null) {
    res.status(404).json({ msg: "그런 지역 없다.." });
    return;
  }

  const dust = await Dust.search(region.properties.adm_nm);
  const weather = await Weather.search(region.properties.adm_nm);

  res.status(200).json({ dust, weather });
});

module.exports = router;
