const fs = require("fs");
const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");
const slugify = require("slugify");
const braintree = require("braintree");
const dotenv = require("dotenv");
const orderModel = require("../models/OrderModel");

dotenv.config();

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.MERCHANT_ID,
  publicKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY,
});

const createProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    switch (true) {
      case !name:
        return res.status(200).send({ message: "Name is required" });
      case !description:
        return res.status(200).send({ message: "Description is required" });
      case !price:
        return res.status(200).send({ message: "Price is required" });
      case !category:
        return res.status(200).send({ message: "category is required" });
      case !quantity:
        return res.status(200).send({ message: "Quantity is required" });
      case photo && photo.size > 1000000:
        return res
          .status(200)
          .send({ message: "Photo is required and less then 1mb" });
      case !shipping:
        return res.status(200).send({ message: "shipping is required" });
    }

    const existCategory = await categoryModel.findById(category);
    if (!existCategory) {
      return res.status(200).send({
        success: false,
        message: "Category not exists...",
      });
    }

    const products = new productModel({
      ...req.fields,
      slug: slugify(name),
    });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product created successfully...",
      products,
    });
  } catch (err) {
    res.status(200).send({
      success: false,
      message: "error while creating product",
      err,
    });
  }
};

const getAllProductsController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .select("-photo")
      .populate("category")
      .sort({ createdAt: -1 });
    if (products === null) {
      return res.status(200).send({
        success: true,
        message: "there is no products are available",
        products,
      });
    }
    res.status(200).send({
      success: true,
      totalProducts: products.length,
      message: "products fetched successfully",
      products,
    });
  } catch (err) {
    res.status(200).send({
      success: false,
      message: "error while getting the products",
    });
  }
};

const getSingleProductController = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await productModel
      .findById(id)
      .populate("category")
      .select("-photo");

    res.status(200).send({
      success: true,
      message: "product fetched successfully",
      product,
    });
  } catch (err) {
    res.status(200).send({
      success: false,
      message: "error while getting the product",
      err,
    });
  }
};

const getProductPhotoController = async (req, res) => {
  try {
    const productPhoto = await productModel
      .findById(req.params.pid)
      .select("photo");

    if (productPhoto.photo.data) {
      res.set("content-type", productPhoto.photo.contentType);
      return res.status(200).send(productPhoto.photo.data);
    }
  } catch (err) {
    res.status(200).send({
      success: false,
      message: "error while getting the product photo ",
      err,
    });
  }
};

const deleteProductController = async (req, res) => {
  try {
    const id = req.params.id;

    const existProduct = await productModel.findById(id);

    if (!existProduct) {
      return res.status(200).send({
        success: false,
        message: "there id no product on this Id",
        existProduct,
      });
    }

    const deletedProduct = await productModel.findByIdAndDelete(id);

    res.status(200).send({
      success: true,
      message: "Product deleted successfully....",
      deletedProduct,
    });
  } catch (err) {
    res.status(200).send({
      success: false,
      message: "error while deleting the product",
      err,
    });
  }
};

const updateProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    const products = await productModel.findByIdAndUpdate(
      req.params.id,
      { ...req.fields, slug: slugify(name), photo },
      { new: true }
    );

    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product updated successfully...",
      products,
      photo,
    });
  } catch (err) {
    res.status(200).send({
      success: false,
      message: "error while updating product",
      err,
    });
  }
};

const filterProductController = async (req, res) => {
  try {
    const { checked, radioCheck } = req.body;

    const args = {};

    if (checked.length > 0) args.category = checked;
    if (radioCheck.length)
      args.price = { $gte: radioCheck[0], $lte: radioCheck[1] };

    const products = await productModel.find(args).select("-photo");

    res.status(200).send({
      success: true,
      message: "filtered successfully",
      products,
    });
  } catch (err) {
    res.status(200).send({
      success: false,
      message: "something went wrong while filtering the product",
    });
  }
};

// const productCountController = async (req, res) => {
//   try {
//     const { checked, radioCheck } = req.body;

//     const arg = {};

//     if (checked.length > 0) arg.category = checked;
//     if (radioCheck.length)
//       arg.price = { $gte: radioCheck[0], $lte: radioCheck[1] };

//     const productsCount = await productModel.find(arg).estimatedDocumentCount();

//     res.status(200).send({
//       success: true,
//       message: "filtered successfully",
//       productsCount
      
//     });
//   } catch (err) {
//     res.status(200).send({
//       success: false,
//       message: "something went wrong while filtering the product",
//     });
//   }
// };
// const productsPerPage = async (req, res) => {
//   try {
//     const page = req.params.page ? req.params.page : 1;
//     const perPage = 3;
//     const products = await productModel
//       .find({})
//       .select("-photo")
//       .skip((page - 1) * perPage)
//       .limit(perPage)
//       .sort({ createdAt: -1 });
//     res.status(200).send({
//       success: true,
//       message: "products are fetched successfully",
//       products,
//     });
//   } catch (err) {
//     res.status(200).send({
//       success: false,
//       message: "something went wrong in productPerPage",
//       err,
//     });
//   }
// };

const productSearchController = async (req, res) => {
  try {
    const { keyword } = req.params;

    const products = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "succefully fetched searched data",
      products,
    });
  } catch (err) {
    res.status(200).send({
      success: false,
      message: "error occurs while serch for a product",
      err,
    });
  }
};

const getSimilarProducts = async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const similarProducts = await productModel
      .find({
        _id: { $ne: pid },
        category: cid,
      })
      .limit(3)
      .select("-photo")
      .populate("category");

    res.status(200).send({
      success: true,
      message: "fetched similar products",
      similarProducts,
    });
  } catch (err) {
    res.send(200).send({
      success: false,
      message: "something went wrong while getting similar products",
      err,
    });
  }
};

const categoryProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({ category: req.params.cid })
      .select("-photo");
    res.status(200).send({
      success: true,
      message: "product fetched categorywise successfully",
      products,
    });
  } catch (err) {
    res.status(200).send({
      success: false,
      message: "something went wrong while getting product categorywise",
      err,
    });
  }
};

// gateWay Token
const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, (err, response) => {
      if (response) {
        res.send(response.clientToken);
      } else {
        res.status(200).send({
          success: false,
          message: "error while getting the client token inside",
          err,
        });
      }
    });
  } catch (err) {
    res.status(200).send({
      success: false,
      message: "error while getting the token",
      err,
    });
  }
};

const braintreePaymentController = async (req, res) => {
  try {
    const { cart, nonce } = req.body;

    let total = 0;
    cart.map((item) => {
      return (total += item.price);
    });

    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      (error, result) => {
        if (result) {
          const payment = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.status(200).send({
            success: true,
            message: "Payment Completed Successfully",
            result,
          });
        } else {
          res.status(200).send({
            success: false,
            message: "error while making a payment",
            err,
          });
        }
      }
    );
  } catch (err) {
    res.status(200).send({
      success: false,
      message: "error while making the payment",
      err,
    });
  }
};

const getOrderController = async (req, res) => {
  try {
    const id = req.user._id;
    const orders = await orderModel
      .find({ buyer: id })
      .populate("products", "-photo")
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "All orders are fetched",
      orders,
    });
  } catch (err) {
    res.status(200).send({
      success: false,
      message: "something went wrong while gettng orders",
    });
  }
};

const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("buyer", "-password")
      .select("-photo")
      .sort({ createdAt: "-1" });

    res.status(200).send({
      success: true,
      message: "All orders are fetched",
      orders,
    });
  } catch (err) {
    res.status(200).send({
      success: false,
      message: "something went wrong while gettng orders",
    });
  }
};

const changeItemStatusController = async (req, res) => {
  try {
    const id = req.params.order_id;
    const {status}=req.body

    const item = await orderModel.findByIdAndUpdate(id,{status},{new:true})
    res.status(200).send({
      success:true,
      message:"item status updated successfully",
      item
    })
  } catch (err) {
    res.status(200).send({
      success: false,
      message: "something went wrong while updating item status",
    });
  }
};

module.exports = {
  createProductController,
  updateProductController,
  deleteProductController,
  getAllProductsController,
  getSingleProductController,
  getProductPhotoController,
  filterProductController,
  productSearchController,
  getSimilarProducts,
  categoryProductController,
  braintreeTokenController,
  braintreePaymentController,
  getOrderController,
  getAllOrdersController,
  changeItemStatusController,
};

