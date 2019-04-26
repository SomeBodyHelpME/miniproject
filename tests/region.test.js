const assert = require("assert");
const Region = require("../models/region");
const mongoose = require("mongoose");

describe("Region Test", function () {
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

    it("- 특정 위경도가 속한 지역 찾기", function (done) {
        Region.findNear(126.97688884274817, 37.57565077944879).then(regionFullName => {
            assert.equal(true, regionFullName != null);
            done();
        });
    });

    it("- 어느 구역에도 속하지 않는 위경도의 경우 null를 반환한다.", function (done) {
        Region.findNear(-126.97688884274817, -37.57565077944879).then(regionFullName => {
            assert.equal(true, regionFullName == null);
            done();
        })
    });

    it("- 서울특별시로 시작하는 지역은 두 번째 단락이 '구'로 끝나야 한다.", function (done) {
        Region.find({
            "properties.adm_nm": /^서울특별시/
        }).then(results => {
            assert.equal(
                true,
                results.every(result => {
                    const regionName = result.properties.adm_nm.split(" ")[1];
                    return regionName.endsWith("구");
                })
            );
            done();
        });
    }).timeout(10000);

    it('- 키워드를 통한 검색이 잘 동작한다.', function (done) {
        const keyword = '서울'
        Region.findAllByRegionName(keyword)
            .then(regions => {
                assert.equal(true, regions.every(region => region.properties.adm_nm.includes(keyword)))
                done();
            })
    })

    // it('- toDto()를 이용해 dto로 변환할 수 있다.', async function (done) {
    //     // given
    //     const region = await Region.findOne()

    //     // when
    //     const dto = region.toDto()

    //     console.log(region)
    //     console.log(dto)
    //     // then
    //     assert.equal(dto.regionName, region.properties.adm_nm)
    //     assert.equal(dto.id, region._id)

    //     done();
    // })
    it('- toDto()를 이용해 dto로 변환할 수 있다.', function (done) {
        Region.findOne()
            .then(region => {
                const dto = region.toDto()
                assert.equal(dto.regionName, region.properties.adm_nm)
                assert.equal(dto.id, region._id)

                done();
            })
    })
});