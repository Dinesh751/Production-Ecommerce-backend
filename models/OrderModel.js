const mongoose= require("mongoose")

const orderSchema=new mongoose.Schema({
    products:[
    {
        type:mongoose.ObjectId,
        ref:"Products"
    }
    ],
    buyer:{
        type:mongoose.ObjectId,
        ref:"users"
    },
    payment:{
    },
    status:{
        type:String,
        default:"Not Process",
        enum:["Not Process","Processing","Shipped","Delivered","cancelled" ]
    }

},{
    timestamps:true
})

module.exports=mongoose.model("Orders",orderSchema)