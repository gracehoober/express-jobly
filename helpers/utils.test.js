const { BadRequestError } = require("../expressError");
const prepareData = require("./utils");

describe("Works for valid inputs ", function () {
  test("works: for valid minEmployees and maxEmployees", function () {
    const response = prepareData(
      { nameLike: "SampleCompany", maxEmployees: "300", minEmployees: "20" }
    );
    expect(response).toEqual(
      { nameLike: "SampleCompany", maxEmployees: 300, minEmployees: 20 }
    );
  });

});

describe("Works for invalid inputs", function () {
  test("returns NaN for invalid maxEmployees", function () {
    const response = prepareData(
      {
        nameLike: "SampleCompany",
        maxEmployees: "sampleMax",
        minEmployees: "sampleMin"
      }
    );
    expect(response).toEqual(
      { nameLike: "SampleCompany", maxEmployees: NaN, minEmployees: NaN }
    );
  });
});

describe("Works for invalid inputs", function () {
  test("Throws error if minEmployees is greater than maxEmployees", function () {

    expect(() => prepareData(
      {
        nameLike: "SampleCompany",
        maxEmployees: "400",
        minEmployees: "600"
      }
    )).toThrow(BadRequestError);

  });
});
