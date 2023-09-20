"use strict";

const { BadRequestError } = require("../expressError");
const { sqlForPartialUpdate, sqlForFilteringCompanies } = require("./sql");


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


////////


describe("Get All: Good filtering parameters passed (or none) return expected value", function () {
  test("works: One correct filtering criteria provided", function () {
    const response = sqlForFilteringCompanies(
      { nameLike: "apple" },
      { nameLike, minEmployees, maxEmployees }
    );

    expect(response).toEqual("WHERE name ILIKE %apple%");
  });

  test("works: Two correct filtering criteria provided", function () {
    const response = sqlForFilteringCompanies(
      { nameLike: "apple", minEmployees: 10 },
      { nameLike, minEmployees, maxEmployees }
    );

    expect(response).toEqual("WHERE name ILIKE %apple% AND num_employees >= 10");
  });

  test("works: Three correct filtering criteria provided", function () {
    const response = sqlForFilteringCompanies(
      { nameLike: "apple", minEmployees: 10, maxEmployees: 1000 },
      { nameLike, minEmployees, maxEmployees }
    );

    expect(response).toEqual("WHERE name ILIKE %apple% AND num_employees >= 10 AND num_employees <= 1000");
  });

  test("works: No filtering criteria provided", function () {
    const response = sqlForFilteringCompanies(
      {},
      { nameLike, minEmployees, maxEmployees }
    );

    expect(response).toEqual("");
  });
});


// describe("Partial Update: Incorrect inputs return expected responses", function () {
//   test("Error expected: Empty data provided", function () {

//     expect(() => sqlForPartialUpdate(
//       {},
//       {
//         firstName: "first_name",
//         lastName: "last_name",
//         isAdmin: "is_admin",
//       }
//     )
//     ).toThrow(BadRequestError);

//   });

//   test("Partial Update: Error expected: No data provided", function () {
//     expect(() => sqlForPartialUpdate()).toThrow(TypeError);
//   });
// });


