"use strict";

const { BadRequestError } = require("../expressError");
const { sqlForPartialUpdate, sqlForFilteringCompanies } = require("./sql");

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


//** Tests for sqlForFilteringCompanies */

describe("Get All: Good filtering parameters passed (or none) return expected value", function () {
  test("works: One correct filtering criteria provided", function () {
    const response = sqlForFilteringCompanies(
      { nameLike: "apple" },
      {
        nameLike: ["name", "ILIKE"],
        minEmployees: ["num_employees", ">="],
        maxEmployees: ["num_employees", "<="]
      }
    );

    expect(response).toEqual({
      whereClause: 'WHERE name ILIKE $1',
      values: ["apple"]
    });
  });

  test("works: Two correct filtering criteria provided", function () {
    const response = sqlForFilteringCompanies(
      { nameLike: "apple", minEmployees: 10 },
      {
        nameLike: ["name", "ILIKE"],
        minEmployees: ["num_employees", ">="],
        maxEmployees: ["num_employees", "<="]
      }
    );

    expect(response).toEqual({
      whereClause: 'WHERE name ILIKE $1 AND num_employees >= $2',
      values: ["apple", 10]
    });
  });

  test("works: Three correct filtering criteria provided", function () {
    const response = sqlForFilteringCompanies(
      { nameLike: "apple", minEmployees: 10, maxEmployees: 1000 },
      {
        nameLike: ["name", "ILIKE"],
        minEmployees: ["num_employees", ">="],
        maxEmployees: ["num_employees", "<="]
      }
    );

    expect(response).toEqual({
      whereClause: 'WHERE name ILIKE $1 AND num_employees >= $2 AND num_employees <= $3',
      values: ["apple", 10, 1000]
    });
  });

  test("works: No filtering criteria provided", function () {
    const response = sqlForFilteringCompanies(
      {},
      {
        nameLike: ["name", "ILIKE"],
        minEmployees: ["num_employees", ">="],
        maxEmployees: ["num_employees", "<="]
      }
    );

    expect(response).toEqual({ whereClause: "", value: [] });
  });
});




