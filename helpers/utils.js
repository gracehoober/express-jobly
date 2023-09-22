"use strict";

const { BadRequestError } = require("../expressError");

/**Takes data and converts designated strings to integers.
 * Error is thrown if minEmployees is less than maxEmployees.
*/

function prepareData(data) {

  if (data.minEmployees) data.minEmployees = Number(data.minEmployees);
  if (data.maxEmployees) data.maxEmployees = Number(data.maxEmployees);

  if (data.minSalary) data.minSalary = Number(data.minSalary);
  if (data.hasEquity === "true") data.hasEquity = true;
  if (data.hasEquity === "false") data.hasEquity = false;

  if ((data.minEmployees && data.maxEmployees) && (data.minEmployees > data.maxEmployees)) {
    throw new BadRequestError("Minimum employees must be less than maximum employees");
  }

  return data;
}

module.exports = prepareData;