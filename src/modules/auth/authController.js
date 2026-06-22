const authService=require("./authService");
const {successResponse}= require("../../helpers/responseHelper");

const signup= async (req,res)=>{
    const user= await authService.signup(req.body);

    successResponse(res,200,"User Created Successfully",user);

}
const login= async (req,res)=>{
    const user=await authService.login(req.body);

    successResponse(res,200,"User logged in successfully",user);
}
module.exports={
    signup,
    login
};