"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for companies. */

class Job {
  /** Create a Job (from data), update db, return new job data.
   *
   * data should be { title, salary, equity, companyHandle }
   *
   * Returns { title, salary, equity, companyHandle }
   *
   * Throws BadRequestError if job already in database.
   * */

  static async create({ title, salary, equity, companyHandle }) {

    const result = await db.query(`
                INSERT INTO jobs (title,
                                       salary,
                                       equity,
                                       company_handle)
                VALUES ($1, $2, $3, $4)
                RETURNING
                title,
                salary,
                equity,
                company_handle AS "companyHandle",
                    logo_url AS "logoUrl"`, [
      title,
      salary,
      equity,
      companyHandle,
    ],
    );
    const job = result.rows[0];

    return job;
  }

  /** Find all jobs.
   * Takes optional input of data like: { title: "apple", minSalary: 1000 }
   * Returns [{ title, salary, equity, companyHandle }, ...]
   * */

  static async findAll(data) {
    const { whereClause, values } = this.sqlForFilteringJobs(
      data,
      {
        title: ["title", "ILIKE"],
        minSalary: ["salary", ">="],
        hasEquity: ["equity", ">="]
      });

    const jobsRes = await db.query(`
        SELECT title,
            salary,
            equity,
            company_handle AS "companyHandle"
        FROM jobs
        ${whereClause}
        ORDER BY title`, values);
    return jobsRes.rows;
  }

  /** Given a company handle, return all jobs for that company.
   *
   * Returns { title, salary, equity, companyHandle }
   *   where jobs is [{ id, title, salary, equity, companyHandle }, ...]
   *
   * Throws NotFoundError if not found.
   **/

  static async get(company_handle) {
    const jobsRes = await db.query(`
        SELECT title,
        salary,
        equity,
        company_handle AS "companyHandle"
        FROM jobs
        WHERE company_handle = $1`, [company_handle]);

    const jobs = jobsRes.rows[0];

    if (!jobs) throw new NotFoundError(`No jobs: ${company_handle}`);

    return jobs;
  }

  /** Update job data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: {name, description, numEmployees, logoUrl}
   *
   * Returns {handle, name, description, numEmployees, logoUrl}
   *
   * Throws NotFoundError if not found.
   */

  static async update(handle, data) {

    const { setCols, values } = sqlForPartialUpdate(
      data,
      {
        title: "title",
        salary: "salary",
        equity: "equity",
      });
    const handleVarIdx = "$" + (values.length + 1);

    const querySql = `
        UPDATE jobs
        SET ${setCols}
        WHERE handle = ${handleVarIdx}
        RETURNING
            title,
            salary,
            equity,
            company_handle AS "companyHandle"`;
    const result = await db.query(querySql, [...values, handle]);
    const job = result.rows[0];

    if (!company) throw new NotFoundError(`No company: ${handle}`);

    return job;
  }

  /** Delete given job from database; returns undefined.
   *
   * Throws NotFoundError if job not found.
   **/

  static async remove(id) {
    const result = await db.query(`
        DELETE
        FROM jobs
        WHERE id = $1
        RETURNING handle`, [id]);
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job: ${id}`);
  }


  /** Translates input information (from data and jsToSql) into SQL like syntax
 * for database update.
 *
 * data can be like  { nameLike: "apple", minEmployees: 10 },
 *  but can have an additional property called maxEmployees.
 *
 * jsToSql is {
        nameLike: ["name", "ILIKE"],
        minEmployees: ["num_employees", ">="],
        maxEmployees: ["num_employees", "<="]
      }

 *  Returns
 *    {
      whereClause: 'WHERE name ILIKE $1 AND num_employees >= $2',
      values: ["apple", 10]
    }
 */
  static sqlForFilteringJobs(dataToUpdate, jsToSql) {

    if (!dataToUpdate || Object.keys(dataToUpdate).length === 0) {
      return { whereClause: "", value: [] };
    }

    if (dataToUpdate["hasEquity"] && dataToUpdate["hasEquity"] === false) {
      delete dataToUpdate["hasEquity"];
    }

    const keys = Object.keys(dataToUpdate);

    if (dataToUpdate["title"]) {
      const initialVal = dataToUpdate["title"];
      const processedVal = "%" + initialVal + "%";
      dataToUpdate["title"] = processedVal;
    }


    // {nameLike: 'apple', ...} => ['name ILIKE $1', ...]
    const cols = keys.map(
      (colName, idx) => `${jsToSql[colName][0]} ${jsToSql[colName][1]} $${idx + 1}`);

      console.log({
        whereClause: "WHERE " + cols.join(" AND "),
        values: Object.values(dataToUpdate),
      })

    return {
      whereClause: "WHERE " + cols.join(" AND "),
      values: Object.values(dataToUpdate),
    };
  }

}


module.exports = Job;
