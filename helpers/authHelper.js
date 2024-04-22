const bcrypt=require("bcryptjs")

 const hashPassword=async (password)=>{
     try{

        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);
        return hash;
     }catch(err){
        console.log(err)
     }
}

 const comparePassword=(password,hash)=>{
    return bcrypt.compareSync(password, hash);
}

module.exports={hashPassword,comparePassword}