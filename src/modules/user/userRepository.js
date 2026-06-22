const User = require("./userModel");

const findUserById = (userId) => {
    return User.findById(userId);
}

const updateUserById = (id, data) => {
    return User.findByIdAndUpdate(
        id,
        data,
        {
            returnDocument: "after",
            runValidators: true
        }
    );
};

const updateProfilePicture = (userId, imageUrl) => {
    return User.findByIdAndUpdate(userId, {
        profilePicture: imageUrl
    },
        {
            returnDocument: "after"
        });
}

const updateCoverPhoto = (userId, imageUrl) => {
    return User.findByIdAndUpdate(userId, {
        coverPicture: imageUrl
    },
        {
            returnDocument: "after"
        });
}

const findUsersByUsername = (username) => {
    return User.find({
        username: {
            $regex: username,
            $options: "i"
        }
    }).select("username profilePicture bio followers following");
}
const findUserFollowers = (userId) => {
    return User.findById(userId).populate("followers", "username profilePicture bio");
}
const findUserFollowings = (userId) => {
    return User.findById(userId).populate("following", "username profilePicture bio");
}
module.exports = {
    findUserById,
    updateUserById,
    updateProfilePicture,
    updateCoverPhoto,
    findUsersByUsername,
    findUserFollowers,
    findUserFollowings
}