const app = require("./app"); // Import the configured app

const port = process.env.EXPRESS_PORT || 3000;

// This is the ONLY place in your entire project where app.listen should be called.
app.listen(port, () => {
  console.log(`ELR-Converter API listening at port ${port}`);
  console.log(`API documentation available at /api-docs`);
});
