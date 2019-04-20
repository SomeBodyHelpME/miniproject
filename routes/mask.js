const express = require("express");
const router = express.Router();
const authRequired = require('../middlewares/authRequired.middleware')
const Mask = require("../models/mask");

const MASK_STATUS = ['ON', 'OFF']

router.put("/status", authRequired, async (req, res) => {
  const { status } = req.body;

  if (MASK_STATUS.indexOf(status) == -1) {
    res.status(400).json({
      msg: '올바르지 않은 status입니다.'
    })
    return
  }

  const mask = await Mask.create(req.request_id, status)

  res.status(200).json({
    data: mask
  })
});

module.exports = router;