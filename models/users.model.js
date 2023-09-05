const mongoose = require("mongoose");

const userLoginInfo = mongoose.Schema({
  id: {
    type: Number,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("userLoginInfo", userLoginInfo);