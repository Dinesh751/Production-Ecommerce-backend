const express = require("express");
const colors = require("colors");
const connectDb = require("./config/connectDB");
const morgan = require("morgan");
const cors = require('cors')
const authRoutes= require("./routes/authRoute")
const categoryRoutes=require("./routes/categoryRoute")
const productRoutes=require("./routes/productRoutes");
const path= require("path");




//env config----> not completed
require("dotenv").config();

// connecting to db
connectDb();

// rest object
const app = express();

//middleware
app.use(morgan("dev"));
app.use(express.json())
app.use(cors())






//routing

app.use("/auth",authRoutes)
app.use("/category",categoryRoutes)
app.use("/products",productRoutes)





app.get("/", (req, res) => {
  res.send("<h1>welcome to ecommerce app<h1>");
});

//PORT

const PORT = process.env.PORT;

app.listen(PORT || 8081, () => {
  console.log(`server running on ${PORT}`);
});
