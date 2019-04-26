const assert = require("assert");
const Mask = require("../models/mask");
const mongoose = require("mongoose");

describe("Mask Test", function () {
    before(function (done) {
        mongoose.connect("mongodb://localhost/miniproject", {
            useNewUrlParser: true,
            useCreateIndex: true
        });
        const db = mongoose.connection;
        db.once("open", function () {
            done();
        });
    });

    it("- 마스크 착용 저장", function (done) {
        const date = new Date()
        const user_id = '1'
        const status = 'ON'
        Mask.create(user_id, status)
            .then(mask => {
                assert.equal(mask.user_id, user_id);
                assert.equal(mask.status, status);
                assert.equal(true, date <= mask.at && mask.at < Date.now())
                done()
            })
    });
});