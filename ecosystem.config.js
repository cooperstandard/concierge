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
          PORT: 8443,
          //secret: "c6b72bb9d5ed6409c674560f040c7e61f512ccd11b9ff97ed761a308dcff288df6c0acf9dabefebe2160887b69cc5069dbe657bddbfb017b7f01fcbb096d55bd"
        },
      },
    ],
  };