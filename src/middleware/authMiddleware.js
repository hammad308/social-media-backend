const jwt=require("jsonwebtoken");
const AppError=require("../utils/AppError");
const User= require("../modules/user/userModel");

const protect=async (req,res,next)=>{
    const authHeader=req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        throw new AppError("No Token Provided",401);
    }

    const token = authHeader.split(" ")[1];
    const decoded= jwt.verify(token, process.env.JWT_SECRET);
    const user= await User.findById(decoded.userId);
    if(!user){
        throw new AppError("User no longer Exists",401);
    }
    req.user=user;
    next();
}

module.exports=protect;