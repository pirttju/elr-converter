const { pgp } = require("../db"); // Import the pgp instance

// This object will be loaded by Mocha
exports.mochaHooks = {
  // This 'afterAll' hook will run once after all test files have completed
  afterAll: function () {
    // Close the database connection pool
    console.log("All tests finished. Closing database connection pool...");
    pgp.end();
  },
};
