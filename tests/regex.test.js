const assert = require("assert");

const coordinateRegex = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/;

describe("Regex test", function() {
  it(`${coordinateRegex} 는 위경도 표현에 적합하다.`, function(done) {
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
});
