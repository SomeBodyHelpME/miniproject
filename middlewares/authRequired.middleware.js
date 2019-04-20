module.exports = (req, res, next) => {
    console.log(req.headers)
    const { authorization: id } = req.headers;

    if (typeof id === "undefined" || id === null || id.trim() === '') {
        res.status(401).json({
            msg: "Authorization 헤더에 유니크 식별자를 포함해 요청해주세요."
        });
        return;
    }

    req.request_id = id;

    next();
};
