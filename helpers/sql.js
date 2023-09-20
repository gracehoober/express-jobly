"use strict";

const { BadRequestError } = require("../expressError");

// THIS NEEDS SOME GREAT DOCUMENTATION.

/** sqlForPartialUpdate:
 * Takes dataToUpdate (an object containing data to update) -> { firstName, lastName, password, email, isAdmin }
 *  and jsToSql (an object mapping JavaScript column names to their corresponding PSQL column names)
 *
 * Maps jsToSql for all data included in the request, though if the column name not included in jsToSql map -> create a new column in the returned string setCols (which will eventually lead to the creation of a new row in the db).
 *
 *  Returns:
 *    setCols: updated columns in a string -> first_name, last_name, ...
 *    values: list of assigned SQL variables -> [$1, $2, ...]
 *
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

module.exports = { sqlForPartialUpdate };

/**What do we think is going on?
 * I: object of things to update and obj representing database
 * O: {setCols: updated columns in a string
 *      values: array of user keywords like any of these:
 *              firstName, lastName, password, email, isAdmin
 *
 * line 9: if there is any data from dataToUpdate
 * mapping every keys value to a sql column- has to have the same name
 */