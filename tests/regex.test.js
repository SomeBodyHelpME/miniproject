const assert = require("assert");

const coordinateRegex = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/;

describe("Regex test", function () {
  it(`${coordinateRegex} 는 위경도 표현에 적합하다.`, function (done) {
    const testCases = [
      "1,1",
      "1,-1",
      "-1,1",
      "-1,-1",
      "0,0",
      "-1.00,1.00",
      "1.00,-1.00",
      "-1.00,-1.00",
      "1.00,1.00"
    ];

    assert.equal(true, testCases.every(tc => coordinateRegex.test(tc)));
    done();
  });


  it(`지역 검색시 /keyword/를 사용하면 된다.`, function (done) {
    const regionName = "서울특별시 송파구 방이동"
    const testCases = [
      {
        keyword: "방이동",
        matches: true
      },
      {
        keyword: "서울",
        matches: true
      },
      {
        keyword: "방동",
        matches: false
      },
      {
        keyword: "방이2동",
        matches: false
      }
    ]
    

    assert.equal(true, testCases.every(({keyword, matches}) => RegExp(keyword).test(regionName) === matches))
    done()
  })
});
