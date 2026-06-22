const Post = require("./postModel");

const createPost = async (postData) => {
    const post = await Post.create(postData);
    return post.populate("author", "username profilePicture");
}

const findPostById = (id) => {
    return Post.findById(id).populate(
        "author",
        "username profilePicture"
    );
};

const getTotalPostsOfUser = (userId) => {
    return Post.find(
        {
            author: userId
        }
    ).populate("author", "username profilePicture");
}

const findFeedPosts = (cursor, limit) => {
    const query = {}
    if (cursor) {
        query.createdAt = {
            $lt: new Date(cursor)
        }
    }

    return Post.find(query)
        .populate("author", "username profilePicture")
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
}

const deletePostById = (id) => {
    return Post.findByIdAndDelete(id);
}

module.exports = {
    createPost,
    findPostById,
    findFeedPosts,
    deletePostById,
    getTotalPostsOfUser
}