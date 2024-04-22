const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

const requireSignIn = async (req, res, next) => {
  try {
    const decode = jwt.verify(req.headers.authorization, JWT_SECRET);
    // decode in this case it gives user`s _id   (decode._id)
    req.user = decode;

    next();
  } catch (err) {
    console.log(err);
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== 1) {
      return res.status(200).send({
        success: false,
        message: "Unauthorized Access",
      });
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
    res.status(200).send({
      success: false,
      message: "Error in admin middleware",
      err,
    });
  }
};

module.exports = { requireSignIn, isAdmin };