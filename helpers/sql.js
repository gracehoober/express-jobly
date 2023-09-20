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

  console.log("keys", keys);
  console.log("ERROR!",new BadRequestError("No data"));

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


function sqlForFilteringCompanies(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);

  console.log("keys", keys);

  // No error if no keys, just want to return empty (or none).
  if (keys.length === 0) return {};

  for (const key of keys) {
    console.log("Key", key, "Value", jsToSql[key]);
  }

  // {nameLike: 'apple', ...} => ['name ILIKE apple', ...]
  const cols = keys.map((colName, idx) => `"${jsToSql[colName]} ${jsToSql[colName]}"=$${idx + 1}`)

  return {
    setCols: "WHERE " + cols.join(" AND"),
    values: Object.values(dataToUpdate),
  };
}



module.exports = { sqlForPartialUpdate, sqlForFilteringCompanies };
