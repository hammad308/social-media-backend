const errorResponse=(res,statusCode,message)=>{
    return res.status(statusCode).json({
        success:false,
        message,
    });
};

const successResponse=(res,statusCode,message,data=null)=>{
    return res.status(statusCode).json({
        success:true,
        message,
        data
    })
}

module.exports={
    errorResponse,
    successResponse
}