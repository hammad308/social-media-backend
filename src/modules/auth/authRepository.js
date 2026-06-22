const User= require("../user/userModel");

const findUserByEmail= (email)=>{
    return User.findOne({email}).select("+password");
}

const createUser=(userData)=>{
    return User.create(userData);
}

module.exports={
    findUserByEmail,
    createUser
}