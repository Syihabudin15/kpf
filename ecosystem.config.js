module.export = {
  apps: [
    {
      name: "sipboss",
      script: "npm start",
      watch: ".",
      ignore_watch: ["node_modules"],
      env: {
        PORT: 5000,
      },
    },
  ],
  deploy: {
    production: {
      "pre-deploy-local": "",
      "post-deploy":
        "npm install && pm2 reload ecosystem.config.js --production",
      "pre-setup": "",
    },
  },
};
