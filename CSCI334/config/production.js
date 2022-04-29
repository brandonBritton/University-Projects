module.exports = {
  db: {
    host: "csci334-shard-00-00.dmxc1.mongodb.net:27017,csci334-shard-00-01.dmxc1.mongodb.net:27017,csci334-shard-00-02.dmxc1.mongodb.net:27017",
    name: process.env.PRODUCTION_DB_NAME
  },
  JWT_SECRET: "thisisthejwtsecretproduction"
}
