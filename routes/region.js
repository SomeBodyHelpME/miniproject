const express = require("express");
const router = express.Router();
const Region = require("../models/region");

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

// router.get('/:regionId/info', async (req, res) => {
//     const regionId = req.param.regionId

//     const region = await Region.findById(regionId)
// })


module.exports = router;