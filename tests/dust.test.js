const assert = require("assert");
const Dust = require("../models/dust");
const mongoose = require("mongoose");

describe("Dust Test", function () {
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

    it("- findOne 정렬 테스트", function (done) {
        Promise.all([
            Dust.findOne({}, null, { sort: { MSRDT: -1 } }),
            Dust.findOne({}, null, { sort: { MSRDT: 1 } })
        ]).then(results => {
            assert.equal(false, results[0].MSRDT === results[1].MSRDT);
            done();
        });
    });

    it("- text 인덱스 search 테스트", function (done) {
        Dust.search("서울특별시 종로구 사직동")
            .then(dust => {
                assert.equal(true, dust !== null);
                done();
            });
    });
});
