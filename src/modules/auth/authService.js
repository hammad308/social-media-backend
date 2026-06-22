const bcrypt = require("bcrypt");
const Joi = require("joi");

const authRepository = require("./authRepository");
const generateToken = require("../../utils/generateToken");
const AppError = require("../../utils/AppError");

const signupSchema = Joi.object({
    username: Joi.string()
        .trim()
        .required()
        .min(3)
        .max(30)
        .messages({
            "string.empty": "Username is required",
            "string.min": "Username must be at least 3 charaters",
            "string.max": "Username could not exceed 30 characters"
        }),
    email: Joi.string()
        .trim()
        .email()
        .required()
        .messages({
            "string.email": "Please enter a valid email",
            "string.empty": "Email is required"
        }),
    password: Joi.string()
        .required()
        .min(6)
        .max(20)
        .messages({
            "string.empty": "Password is required",
            "string.min": "Password must be at least 6 characters",
            "string.max": "Password could not exceed 20 characters"
        }),
});

const loginSchema = Joi.object({
    email: Joi.string()
        .email()    
        .trim()
        .required()
        .messages({
            "string.empty": "Email is requried",
            "string.email": "Please enter a valid Email"
        }),
    password: Joi.string()
        .required()
        .min(6)
        .max(20)
        .messages({
            "string.empty": "Password is required",
            "string.min": "Password must be at least 6 characters",
            "string.max": "Password could not exceed 30 characters"
        })
})

const signup = async (data) => {
    const { error, value } = signupSchema.validate(data);
    if (error) {
        throw new AppError(error.details[0].message, 400);
    }
    const { username, email, password } = value;
    const existingUser = await authRepository.findUserByEmail(email);
    if (existingUser) {
        throw new AppError("User already Exists", 400);
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await authRepository.createUser({
        email,
        username,
        password: hashedPassword
    });
    const token = generateToken(user._id, user.role);
    return {
        user:{
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        },
        token
    }

}

const login = async (data) => {
    const { error, value } = loginSchema.validate(data);
    if (error) {
        throw new AppError(error.details[0].message, 400);
    }
    const { email, password } = value;
    const existingUser = await authRepository.findUserByEmail(email);
    if (!existingUser) {
        throw new AppError("User doesn't have account on our site", 401);
    }
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
        throw new AppError("Email or Password wrong",401);
    }
    const token = generateToken(existingUser._id, existingUser.role);
    return {
        user:{
            id: existingUser._id,
            username: existingUser.username,
            email: existingUser.email,
            role: existingUser.role
        },
        token
    }
}
module.exports = {
    signup,
    login
}