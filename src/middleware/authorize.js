const {errorResponse}=require("../helpers/responseHelper");
const authorize=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
           return  errorResponse(res,403,"Access denied");
        }
        next();
    }
}

module.exports= authorize;