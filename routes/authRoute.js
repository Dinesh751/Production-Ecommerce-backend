
const express = require("express");
const {
  registerUser,
  loginUser,
  testController,
  forgetPassword,
  updateProfileController,
  getAllUsersController
} = require("../controllers/authController");
const { requireSignIn, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

//routing

// Register user  Method:POST
router.post("/register", registerUser);

// Login user  Method:POST

router.post("/login", loginUser);

// forgot-password Mehtod:POST

router.post("/forgot-password", forgetPassword);

// test

router.post("/test", requireSignIn, isAdmin, testController);

// protected Route for user Method:GET
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

// protected route for admin Method:GET
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

// update profile Method:PUT
router.put("/profile/update-profile", requireSignIn, updateProfileController);

// get all user for admin Method:GET
router.get("/admin/all-users",requireSignIn,isAdmin,getAllUsersController)

module.exports = router