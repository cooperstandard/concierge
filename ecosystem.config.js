module.exports = {
    apps: [
      {
        name: "concierge",
        exec_mode: "fork",
        instances: "1",
        script: "./index.js", // your script
        args: "start",
        env: {
          DATABASE_URL: process.env.DATABASE_URL,
          HOSTNAME: "concierge",
          SHELL: process.env.SHELL
        },
      },
    ],
  };