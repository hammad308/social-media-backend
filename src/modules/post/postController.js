const postService = require("./postService");
const { successResponse } = require("../../helpers/responseHelper");

const createPost = async (req, res) => {
    const post = await postService.createPost(req.body, req.user, req.file);
    successResponse(res, 201, "Post Created Successfully", post)
}

const getFeedPosts = async (req, res) => {
    const posts = await postService.getFeedPosts(req.query.cursor, req.query.limit,req.user._id);
    successResponse(res, 200, "Feed Posts Fetched Successfully", posts);

}

const getPostById = async (req, res) => {
    const post = await postService.getPostById(req.params.id,req.user._id);
    successResponse(res, 200, "Post Fetched Successfully", post);
}

const deletePostById = async (req, res) => {
    await postService.deletePostById(req.params.id, req.user);
    successResponse(res, 200, "Post Deleted Successfully")
}

module.exports = {
    createPost,
    getFeedPosts,
    getPostById,
    deletePostById
}