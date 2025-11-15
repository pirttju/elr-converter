module.exports = {
  apps: [
    {
      name: "elr-converter",
      script: "./server.js",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
