const Reaction= require("./reactionModel");

const findReaction = (postId,userId)=>{
    return Reaction.findOne({
        post:postId,
        user:userId
    });
};

const createReaction= (reactionData)=>{
    return Reaction.create(reactionData);
}

const updateReaction= (reactionId,type)=>{
    return Reaction.findByIdAndUpdate(
        reactionId,
        {type},
        {returnDocument: "after"}
    );
};

const getReactionsByPost = (postId)=>{
    return Reaction.find({
        post:postId
        })
        .populate("user", "username profilePicture")
        .sort({createdAt:-1});
}

const deleteReaction= (reactionId)=>{
    return Reaction.findByIdAndDelete(reactionId);
}

module.exports= {
    findReaction,
    createReaction,
    updateReaction,
    deleteReaction,
    getReactionsByPost
}