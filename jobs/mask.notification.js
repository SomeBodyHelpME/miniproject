const FCM = require('fcm-node');
const fcm_key = require('../config/serviceKey').fcm_key;
const Mask = require('../models/mask');
const User = require('../models/user');

const fcm = new FCM(fcm_key);
const eightHourMilliseconds = 28800000
const job = async () => {
    setInterval(async function () {
        try {
            const date = Date.now();
            const gte = new Date(date - (eightHourMilliseconds + 60000));
            // const lte = new Date(date - (eightHourMilliseconds));
            const lte = new Date(date);
            const results = await Mask.aggregate([ { $match: {at: {$gte: gte, $lte: lte}}}, { $sort: {at: -1}}, {$group: {_id:"$user", at: {$first: "$at"},status: {$first: "$status"}}}])
            const userIds = results.filter(r => r.status === 'ON').map(r => r._id)
            const userTokens = (await User.find({_id: {$in: userIds}}, {firebase_token: 1})).map(u => u.firebase_token)
            console.log(userTokens)
        } catch (err) {
            console.log(err)
        }
    }, 3000)
}


function buildNotification(token) {
    return buildMessage(token, "마스크 권장 착용 시간이 지났어요.", "ㅈㄱㄴ");
}

function buildWarningMessage(token) {
    return buildMessage(token, "마스크 권장 착용 시간이 1시간 남았어요.", "ㅈㄱㄴ");
}
function buildMessage(token, title, message) {
    return push_data = {
        to: token,
        notification: {
            title,
            body: message,
            sound: "default",
            icon: "fcm_push_icon"
        },
        priority: "high",
        restricted_package_name: "com.dust.android",
    };
}
module.exports = job;