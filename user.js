const mongoose = require("mongoose");
const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    organization: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    plantype: {
      type: String,
      required: true,
      // enum: ["6 month", "12 month"],
      // default: "6 month",
    },
    token: {
      type: String,
    },
    otpVerify: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);
const UserModel = mongoose.model("user", UserSchema);
module.exports = UserModel;
