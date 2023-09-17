require("dotenv").config();

const dev = {
  app: {
    port: process.env.PORT || 4000,
  },
  db: {
    url: process.env.DB_URL || "mongodb://localhost:27017/userDB",
  },
  mailSender: {
    mail: process.env.MAIL_SENDER,
  },
  mailPassword: {
    password: process.env.MAIL_PASSWORD,
  },
};

module.exports = dev;