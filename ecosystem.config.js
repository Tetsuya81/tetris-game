module.exports = {
  apps: [{
    name: "smarttetris",
    script: "server.js",
    watch: true,
    env: {
      NODE_ENV: "development",
      PORT: 3000
    },
    env_production: {
      NODE_ENV: "production",
      PORT: 9999
    },
    instances: 1,
    exec_mode: "fork",
    autorestart: true,
    max_memory_restart: "200M"
  }]
};
