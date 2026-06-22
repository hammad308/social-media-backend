const mongoose=require("mongoose");

const connectDB=async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB database Connected");
    }catch(error){
        console.log(error.message);
        console.log(process.env.MONGO_URI);
        console.log(process.env.PORT)
        process.exit(1);
    }
}
module.exports=connectDB;