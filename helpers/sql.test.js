"use strict";

const { BadRequestError } = require("../expressError");
const { sqlForPartialUpdate } = require("./sql");

/** Tests for sqlForPartialUpdate */
describe("Partial Update: All types of requests return expected value", function () {
  test("works: Good data provided", function () {
    const response = sqlForPartialUpdate(
      { firstName: "grace", lastName: "hoober" },
      {
        firstName: "first_name",
        lastName: "last_name",
        isAdmin: "is_admin",
      }
    );

    expect(response).toEqual(
      {
        setCols: '"first_name"=$1, "last_name"=$2',
        values: ['grace', 'hoober']
      }
    );
  });
});


describe("Partial Update: Incorrect inputs return expected responses", function () {
  test("Error expected: Empty data provided", function () {

    expect(() => sqlForPartialUpdate(
      {},
      {
        firstName: "first_name",
        lastName: "last_name",
        isAdmin: "is_admin",
      }
    )
    ).toThrow(BadRequestError);

  });

  test("Partial Update: Error expected: No data provided", function () {
    expect(() => sqlForPartialUpdate()).toThrow(TypeError);
  });
});