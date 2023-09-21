"use strict";

const { BadRequestError } = require("../expressError");


/** Translates input information (from data and jsToSql) into SQL like syntax
 * for database update.
 *
 * data can be like { firstName, lastName, password, email, isAdmin },
 *  but can have any or more properties.
 *
 * jsToSql can be like { firstName: "first_name", lastName: "last_name",
 *  sAdmin: "is_admin" }
 *
 *  Returns
 *    { setCols: '"first_name=$1", "last_name=$2", ...',
 *      values: ["aFirstName", "aLastName"]}
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);


  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
    `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

// /** Translates input information (from data and jsToSql) into SQL like syntax
//  * for database update.
//  *
//  * data can be like  { nameLike: "apple", minEmployees: 10 },
//  *  but can have an additional property called maxEmployees.
//  *
//  * jsToSql is {
//         nameLike: ["name", "ILIKE"],
//         minEmployees: ["num_employees", ">="],
//         maxEmployees: ["num_employees", "<="]
//       }

//  *  Returns
//  *    {
//       whereClause: 'WHERE name ILIKE $1 AND num_employees >= $2',
//       values: ["apple", 10]
//     }
//  */
// // TODO: Move this into model function (company.js)
// function sqlForFilteringCompanies(dataToUpdate, jsToSql) {

//   if (!dataToUpdate || Object.keys(dataToUpdate).length === 0) {
//     return { whereClause: "", value: [] };
//   }

//   const keys = Object.keys(dataToUpdate);

//   if (dataToUpdate["nameLike"]) {
//     const initialVal = dataToUpdate["nameLike"];
//     const processedVal = "%" + initialVal + "%";
//     dataToUpdate["nameLike"] = processedVal;
//   }

//   // {nameLike: 'apple', ...} => ['name ILIKE $1', ...]
//   const cols = keys.map(
//     (colName, idx) => `${jsToSql[colName][0]} ${jsToSql[colName][1]} $${idx + 1}`);

//   return {
//     whereClause: "WHERE " + cols.join(" AND "),
//     values: Object.values(dataToUpdate),
//   };
// }


module.exports = { sqlForPartialUpdate };
