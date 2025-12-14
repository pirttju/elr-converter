module.exports = {
  apps: [
    {
      name: "mileage-converter",
      script: "./server.js",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
