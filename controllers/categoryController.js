const slugify = require("slugify");
const categoryModel = require("../models/categoryModel");





const createCategoryController=async (req,res)=>{
   
   try{
    const {name}=req.body;

   if(!name){
       return res.status(200).send({
        success:false,
        message:"Please select the category name....."
       })
   }

   const existCategory=await categoryModel.findOne({slug:slugify(name)});

   if(existCategory!==null){
    return res.status(200).send({
        success:false,
        message:"The category is already exists...."
    })
   }
   const category=await new categoryModel({name,slug:slugify(name)}).save();

     res.status(201).send({
        category,
        success:true,
        message:"category is Added successfully ..."
     })


   }catch(err){
    res.status(200).send({
        success:false,
        message:"error in create category.....",
        err
    })
   }
}




const updateCategoryController=async (req,res)=>{
       try{
        const {name}=req.body;
        const {id}=req.params;

        if(!name){
            return res.status(200).send({
                success:false,
                message:"Please enter the new category..."
            })
        }
       

        const category=await categoryModel.findOne({_id:id});

        if(category === null){
           return res.status(200).send({
            success:false,
            message:"there is no category on the given id..."
           })
        }

        const updateCategory= await categoryModel.findByIdAndUpdate(id,{name:name,slug:slugify(name)},{new:true})
        res.status(200).send({
            success:true,
            message:"Updated successfully...",
            updateCategory
        })

       }catch(err){
        res.status(200).send({
            success:false,
            message:"error in updating category ",
            err
        })
       }
}

const getAllCategoryController=async(req,res)=>{
    try{

        const allCategory= await categoryModel.find({});
        
            res.status(200).send({
               success:true,
               message:"All Category List",
               allCategory
            })
        

    }catch(err){
        res.status(200).send({
            success:false,
            message: "error while getting categories",
            err
        })
    }

}

const singleCategoryController=async (req,res)=>{
   try{
    
    const category=await categoryModel.findOne({slug:req.params.slug})
    if(category===null){
        return res.status(200).send({
            success:false,
            message:"there is no category on that name"
        })
        
    }
    res.status(200).send({
       success:true,
       message:"category fetched successfully",
       category
    })


   }catch(err){
    res.status(200).send({
        success:false,
        message:"error while getting the category",
        err
    })
   }
}


const deleteCategoryController=async(req,res)=>{
    try{
        const id=req.params.id
        await categoryModel.findByIdAndDelete(id)
        res.status(200).send({
            success:true,
            message:"deleted category successfully...."
        })


    }catch(err){
        res.status(200).send({
            success:false,
            message:"error while deleting category"
        })
    }
}

module.exports={createCategoryController,updateCategoryController,getAllCategoryController,singleCategoryController,deleteCategoryController}