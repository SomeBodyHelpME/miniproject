const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Region = require("../models/region");
const Dust = require("../models/dust");
const Weather = require("../models/weather");
const authRequired = require("../middlewares/authRequired.middleware");

/* GET users listing. */
router.put("/token", async (req, res) => {
  const { authorization: deviceId } = req.headers;
  if (typeof deviceId === "undefined") {
    res.status(400).json({
      msg: "Authorization 헤더 채워서 보내세요.."
    });
    return;
  }

  const { firebaseToken } = req.body;

  if (typeof firebaseToken === "undefined") {
    res.status(400).json({
      msg: "firebaseToken 주세요.."
    });
    return;
  }

  const user = await User.findOne({device_id: deviceId})
  
  if (user === null) {
    res.status(200).json({ data: await User.create(deviceId, firebaseToken) });
    return;
  }
  
  await user.updateToken(firebaseToken)
  
  res.status(200).json({ data:  user});
});

router.put("/me/regions", authRequired, async (req, res) => {
  const user = req.user;
  const { regionIds } = req.body;

  await user.changeRegions(regionIds);

  res.status(200).json({ msg: "와 굿", data: regionIds });
});

router.get("/me/regions", authRequired, async (req, res) => {
  const user = req.user;
  const regionIds = user.regions;

  const regionNames = (await Region.find({ _id: { $in: regionIds } })).map(
    r => r.properties.adm_nm
  );

  const results = await Promise.all(regionNames.map(getInfo));

  res.status(200).json({ msg: "와 굿", data: results });
});

function getInfo(regionName) {
  return Promise.all([
    Dust.search(regionName),
    Weather.search(regionName)
  ]).then(results => {
    return {
      name: regionName,
      dust: results[0],
      weather: results[1]
    };
  });
}

module.exports = router;
