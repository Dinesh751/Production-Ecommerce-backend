const express = require("express");
const { requireSignIn, isAdmin } = require("../middleware/authMiddleware");
const {
  createCategoryController,
  updateCategoryController,
  getAllCategoryController,
  singleCategoryController,
  deleteCategoryController
} = require("../controllers/categoryController");

const router = express.Router();

// create category Method:POST
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController
);

// update Category Method:PUT
router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  updateCategoryController
);

// get all the category Method:GET

router.get("/get-category", getAllCategoryController);

//get a single category

router.get("/single-category/:slug", singleCategoryController);

//delete category Method:DELETE

router.delete(
  "/delete-category/:id",
  requireSignIn,
  isAdmin,
  deleteCategoryController
);

module.exports = router;