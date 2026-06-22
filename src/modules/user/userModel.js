const mongoose=require("mongoose");

const userSchema= new mongoose.Schema({
    username:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
        lowercase:true,
    },
    profilePicture:{
        type:String,
        default:""
    },
    coverPicture:{
        type:String,
        default:""
    },
    googleId:{
        type:String
    },
    password:{
        type:String,
        select:false
    },
    bio:{
        type:String,
        default:"",
        maxlength:[150,"Bio cannot exceed 150 characters"]
    },
    role:{
        type:String,
        default:"user",
        enum:["user","admin"]
    },
    followers:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
],
    following:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
]
});

module.exports= mongoose.model("User",userSchema);