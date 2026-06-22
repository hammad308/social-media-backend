const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const authRoutes = require("./modules/auth/authRoutes");
const errorHandler = require("./middleware/errorMiddleware");
const protect = require("./middleware/authMiddleware");
const authorize = require("./middleware/authorize");
const userRoutes = require("./modules/user/userRoutes");
const postRoutes = require("./modules/post/postRoutes");
const commentRoutes = require("./modules/comment/commentRoutes");
const reactionRoutes = require("./modules/reaction/reactionRoutes");
const notificationRoutes = require("./modules/notification/notificationRoutes");
const conversationRoutes = require("./modules/chat/conversationRoutes");
const messageRoutes = require("./modules/chat/messageRoutes");
const passport = require("./config/passport");

app.use(passport.initialize());
app.use(express.json());

app.use(morgan("dev"));



app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true
}));

// app.use(mongoSanitize())


app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/posts", postRoutes);

app.use("/api", commentRoutes);

app.use("/api", reactionRoutes);

app.use("/api", notificationRoutes);

app.use("/api/conversations", conversationRoutes);

app.use("/api/conversations", messageRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to Home Page")
});

app.get("/api/test-protected", protect, (req, res) => {
    res.json({
        success: true,
        message: "Protected Route accessed",
        user: req.user
    })
})

app.get("/api/admin-test", protect, authorize("admin"), (req, res) => {
    res.json({
        success: true,
        message: "Admin route accessed",
        user: req.user
    })
})


app.use(errorHandler);

module.exports = app;