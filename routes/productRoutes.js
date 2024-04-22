const {
    createProductController,
    updateProductController,
    getAllProductsController,
    getSingleProductController,
    deleteProductController,
    getProductPhotoController,
    filterProductController,
   
    productsPerPage,
    productSearchController,
    getSimilarProducts,
    categoryProductController,
    braintreeTokenController,
    braintreePaymentController,
    getOrderController,
    getAllOrdersController,
    changeItemStatusController
   
  } = require("../controllers/productController");
  const formidable = require("express-formidable");
  const braintree=require("braintree")
  
  const express = require("express");
  const { requireSignIn, isAdmin } = require("../middleware/authMiddleware");
  
  const router = express.Router();
  
  
  
  
  
  // create a product Method:POST
  router.post(
    "/create-product",
    requireSignIn,
    isAdmin,
    formidable(),
    createProductController
  );
  
  // get all products Method:GET
  router.get("/get-all-products", getAllProductsController);
  
  // get single product Method:GET
  router.get("/get-single-product/:slug/:id", getSingleProductController);
  
  //get photo product Method:GET
  router.get("/product-photo/:pid", getProductPhotoController);
  
  // delete product Method:DELETE
  router.delete(
    "/delete-product/:slug/:id",
    requireSignIn,
    isAdmin,
    deleteProductController
  );
  
  //update product Method:UPDATE
  router.put(
    "/update-product/:slug/:id",
    requireSignIn,
    isAdmin,
    formidable(),
    updateProductController
  );
  
  // filter product based on category and price Method:POST
  router.post("/filter-products", filterProductController);
  
  
  
  
  
  // product search Method:GET
  router.get("/search/:keyword",productSearchController)
  
  
  
  // get related products Method:GET
  router.get("/similar-product/:cid/:pid",getSimilarProducts)
  
  // get category wise products Method:GET
  router.get("/category/:slug/:cid",categoryProductController)
  
  //get gateway token Method:GET
  router.get("/braintree/client_token",braintreeTokenController );
  
  // make a  payment Method:POST
  router.post("/braintree/payment",requireSignIn,braintreePaymentController)
  
  // getting all orders Methods:GET
  router.get("/user/orders",requireSignIn,getOrderController)
  
  // getting all orders for admin Method:GET
  router.get("/admin/orders",requireSignIn,isAdmin,getAllOrdersController)
  
  // change order status Method:PUT
  router.put("/admin/orders/:order_id",requireSignIn,isAdmin,changeItemStatusController)
  
  module.exports = router;