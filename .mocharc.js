module.exports = {
  // Specify the test file pattern
  spec: "test/**/*.test.js",
  // Set a timeout for tests
  timeout: 5000,
  // Tell Mocha to load our new hooks file before running any tests
  require: "./test/hooks.js",
  // Exit the test runner once all tests have completed
  exit: true,
};
