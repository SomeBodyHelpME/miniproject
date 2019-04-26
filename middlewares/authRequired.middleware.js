const User = require('../models/user');

module.exports = async (req, res, next) => {
    console.log(req.headers)
    const { authorization: deviceId } = req.headers;

    if (typeof deviceId === "undefined" || deviceId === null || deviceId.trim() === '') {
        res.status(401).json({
            msg: "Authorization 헤더에 유니크 식별자를 포함해 요청해주세요."
        });
        return;
    }

    const user = await User.findOne({device_id: deviceId});

    if (user === null) {
        res.status(401).json({
            msg: "존재하지 않는 사용자에요."
        });
        return;
    }

    req.request_id = deviceId;
    req.user = user;

    next();
};
