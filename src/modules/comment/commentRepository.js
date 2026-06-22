const Comment=require("./commentModel");

const createComment= (commentData)=>{
    return Comment.create(commentData);
}

const findCommentsByPost = (cursor,limit,postId)=>{
    const query= {
        post:postId
    }
    if(cursor){
        query.createdAt={
            $lt: new Date (cursor)
        }
    };
    return Comment.find(query)
        .populate("author","username profilePicture")
        .sort({
            createdAt: -1
        })
        .limit(limit);
}

const findCommentById=(commentId)=>{
    return  Comment.findById(commentId)
        .populate("author", " username profilePicture");
}

const deleteCommentById= (commentId)=>{

    return Comment.findByIdAndDelete(commentId);
}

module.exports= {
    createComment,
    findCommentsByPost,
    findCommentById,
    deleteCommentById
}