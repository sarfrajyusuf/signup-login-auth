const UserModel = require("../models/user");
const RESPONCE = require("../constant/responce");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const SECRETKEY = process.env.SECRET_KEY;

module.exports.register = async (req, res, next) => {
  console.log(req.body, "=============body");
  try {
    const { name, email, phoneNumber, organization, password, plantype } =
      req.body;

    const UserEmail = await UserModel.findOne({
      email,
    });
    if (UserEmail) {
      return res.send({
        msg: "email already exist",
        status: 201,
        success: false,
      });
    }
    let Password = await bcrypt.hash(password, saltRounds);
    const data = await UserModel.create({
      name,
      email,
      phoneNumber,
      organization,
      password: Password,
      plantype,
    });
    if (!data) {
      return RESPONCE.ERROR(res, "user not register");

      //   return res.send({
      //     status: false,
      //     message: "user not register",
      //     response: {},
      //   });
    }
    const Token = jwt.sign(
      {
        data_id: data._id,
        email,
      },
      SECRETKEY
      // {
      //   expiresIn:"2h",
      // }
    );
    const userData = await UserModel.findOneAndUpdate(
      {
        email: email,
      },
      {
        $set: {
          token: Token,
        },
      },
      {
        new: true,
      }
    );
    return RESPONCE.SUCCESS(res, "user register successfully", userData);

    // return res.send({
    //   status: true,
    //   message: "user register",
    //   response: userData,
    // });
  } catch (error) {
    next(error);
  }
};
//==============================================Userlogin=========================================
module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const UserEmail = await UserModel.findOne({
      email,
    });
    if (!UserEmail) {
      // return RESPONCE.ERROR(res, 'invalid user name and password')
      return res.send({
        msg: "invalid username or password",
        status: 201,
        success: false,
      });
    }
    const Password = await bcrypt.compare(password, UserEmail.password);
    if (!Password) {
      //  return RESPONCE.ERROR(res, 'invalid user name and password')
      return res.send({
        msg: "invalid username or password",
        status: 201,
        success: false,
      });
    }
    const Token = jwt.sign(
      {
        UserEmail: UserEmail._id,
        email,
      },
      SECRETKEY,
      {
        expiresIn: "2h",
      }
    );

    const userData = await UserModel.findOneAndUpdate(
      {
        email: email,
      },
      {
        $set: {
          token: Token,
        },
      },
      {
        new: true,
      }
    );
    return RESPONCE.SUCCESS(res, "user login successfully", userData);
  } catch (error) {
    next(error);
  }
};
//=============================================getAllData=========================================

module.exports.getUserData = async (req, res, next) => {
  try {
    const getAllData = await UserModel.find();
    if (getAllData) {
      return RESPONCE.SUCCESS(res, "get all data", getAllData);
    } else {
      return RESPONCE.ERROR(res, "not get");
    }
  } catch (error) {
    next(error);
  }
};
//=========================================forgot password=============================================================
module.exports.forgotPassword = async (req, res, next) => {
  try {
    let Otp = Math.floor(Math.random() * 10000 + 1);
    await UserModel.updateOne({ otp: Otp });
    const { email } = req.body;
    const subject = "forgot password with otp verifications";
    const isEmail = await UserModel.findOne({ email });
    console.log(isEmail, "isEmail");
    if (!isEmail) {
      return res.status(200).send({
        status: false,
        message: "user not found",
        response: {},
      });
    }
    const content = `<h1>${Otp}</h1>`;
    sendMail(email, subject, content);
    return res.send({
      status: true,
      message: "email successfully send",
      response: isEmail,
    });
  } catch (error) {
    next(error);
  }
};
//========================================================verify email with otp========================================
module.exports.verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const Email = await UserModel.findOne({ email });
    if (!Email) {
      return res.status(400).send({
        status: false,
        message: "!invalid email",
        response: {},
      });
    }
    const Otp = await UserModel.findOne({ otp });
    if (!Otp) {
      return res.status(400).send({
        status: false,
        message: "!invalid otp",
        response: {},
      });
    }
    Otp.otp = null;
    Otp.otpVerify = true;
    await Otp.save();
    return res.send({
      status: true,
      message: "otp verify successfully",
      response: Otp,
    });
  } catch (error) {
    next(error);
  }
};
//===================================reset Password==================================================================
module.exports.resetPassword = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    const Email = await UserModel.findOne({ email });
    console.log(Email, "email");
    if (!Email) {
      return res.send({
        status: false,
        message: "!email not found",
        response: {},
      });
    }
    if (!Email.otpVerify === true) {
      return res.send({
        status: false,
        message: "plz verify otp",
        response: {},
      });
    }
    Otp.otpVerify = false;
    await Otp.save();
    const Password = await bcrypt.hash(password, saltRounds);
    const resetPassword = await UserModel.findOneAndUpdate(
      { email: Email.email },
      { password: Password },
      { new: true }
    );
    if (resetPassword) {
      return res.send({
        status: true,
        message: "password reset successfully",
        response: resetPassword,
      });
    }
  } catch (error) {
    next(error);
  }
};
