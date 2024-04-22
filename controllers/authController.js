const userModel = require("../models/userModel");
const { hashPassword, comparePassword } = require("../helpers/authHelper");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

// REGISTER USER

const registerUser = async (req, res) => {
  try {
    const { name, email, phone, address, password, answer } = req.body;
    if (!name) {
      return res.send({ error: "Name is required" });
    }
    if (!email) {
      return res.send({ error: "Email is required" });
    }
    if (!phone) {
      return res.send({ error: "Phone is required" });
    }
    if (!address) {
      return res.send({ error: "Address is required" });
    }
    if (!password) {
      return res.send({ error: "Password is required" });
    }

    // User Exist or not
    const existingUser = await userModel.findOne({ email });

    // user Exist
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "user already exists... please login",
      });
    }

    // Register user

    const hpassword = await hashPassword(password);
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hpassword,
      answer,
    }).save();
    res.status(201).send({
      success: true,
      message: "user registered successfully",
      user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: "false",
      message: "error while registration",
      err,
    });
  }
};

// USER  LOGIN METHOD

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(200).send({
        success: false,
        message: " invalid email or password",
      });
    }

    // user Exist or not
    const user = await userModel.findOne({ email });

    // user not Exist
    if (!user) {
      return res.status(200).send({
        success: false,
        message: "please enter the valid email",
      });
    }

    // password match
    const match = comparePassword(password, user.password);

    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Please enter the valid password",
      });
    }

    // create token
    if (match) {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(200).send({
        success: true,
        message: "Login successfull",
        user: {
          email: user.email,
          name: user.name,
          phone: user.phone,
          address: user.address,
          role: user.role,
        },
        token,
      });
    }
  } catch (err) {
    res.send(err);
  }
};

// FORGET-PASSWORD

const forgetPassword = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;

    if (!email) {
      return res.status(200).send({
        success: false,
        message: "Please enter the email",
      });
    }
    if (!newPassword) {
      return res.status(200).send({
        success: false,
        message: "Please enter the password",
      });
    }
    if (!answer) {
      return res.status(200).send({
        success: false,
        message: "Please enter the answer",
      });
    }

    const user = await userModel.findOne({ email, answer });

    if (!user) {
      return res.status(200).send({
        success: false,
        message: "please enter the valid email or answer",
      });
    }
    const hPassword = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hPassword });
    res.status(200).send({
      success: true,
      message: "password changed successfully... ",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "some thing went wrong...!",
      err,
    });
  }
};

// TEST CONTROLLER

const testController = (req, res) => {
  res.send("this is protected route");
};

const updateProfileController = async (req, res) => {
  try {
    const { name, password, phone, address } = req.body;

    if (password && password.length < 8) {
      res.status(200).send({
        success: false,
        message: "password should be 8 characters",
      });
    }
    const hpassword = await hashPassword(password);

    const user = await userModel.findById(req.user._id);
    const updateUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name ? name : user.name,
        password: password ? hpassword : user.password,
        phone: phone ? phone : user.phone,
        address: address ? address : user.address,
      },
      { new: true }
    );

  
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });

    res.status(200).send({
      success: true,
      message: "updated profile successfully",
      token:token,
      user:{
        email: user.email,
          name: updateUser.name,
          phone: updateUser.phone,
          address: updateUser.address,
          role: updateUser.role

      },
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: "error while updating the profile",
      err,
    });
  }
};

const getAllUsersController=async (req,res)=>{
  try{

    const allUsers=await userModel.find().select("-password")
    res.status(200).send({
      success:true,
      message:"all users",
      allUsers
    })

  }catch(err){
    res.status(200).send({
      success:false,
      message:"somthing went wrong while getting all users",
      err
    })
  }
}

module.exports = {
  registerUser,
  loginUser,
  testController,
  forgetPassword,
  updateProfileController,
  getAllUsersController
};