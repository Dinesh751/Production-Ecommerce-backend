const mongoose= require("mongoose")
const colors=require("colors")

//connect to db
const connectdb= async()=>{
    try{
       const conn=await mongoose.connect(process.env.MONGODB_URL).then(()=>{
            console.log("connected to db".bgCyan.white)
        })

    }catch(err){
       console.log(err)
    }
}


module.exports= connectdb;