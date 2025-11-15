class CoordinatesRepository {
  /**
   * @param {Object} db - The database connection object.
   * @param {Object} sql - The pre-loaded SQL queries.
   * @param {Object} pgp - The pg-promise instance.
   */
  constructor(db, sql, pgp) {
    this.db = db;
    this.sql = sql;
    this.pgp = pgp; // pgp is the initialized instance

    // Access ColumnSet from the passed-in pgp object
    this.cs = new pgp.helpers.ColumnSet(
      [
        { name: "id", def: null },
        "elr",
        { name: "miles", def: null, cast: "numeric" },
        { name: "chains", def: null, cast: "numeric" },
        { name: "yards", def: null, cast: "numeric" },
        { name: "kilometres", def: null, cast: "numeric" },
        { name: "metres", def: null, cast: "numeric" },
      ],
      {
        table: "input_data", // A dummy table name is sufficient
      }
    );
  }

  /**
   * Finds a single coordinate by its ELR and mileage.
   */
  async findByElrAndMileage(params, srid) {
    const data = [params];

    // Call the batch method
    const results = await this.findBatch(data, srid);

    // If we got a result, check if the conversion was successful
    if (results && results.length > 0) {
      const result = results[0];
      // A successful conversion will have a non-null longitude
      if (result.longitude !== null) {
        return result;
      }
    }

    // Otherwise, return null to indicate not found
    return null;
  }

  /**
   * Batch converts an array of ELR/mileage objects to coordinates.
   */
  async findBatch(data, srid) {
    const values = this.pgp.helpers.values(data, this.cs);
    return this.db.any(this.sql.findBatch, { values, srid });
  }
}

module.exports = CoordinatesRepository;
