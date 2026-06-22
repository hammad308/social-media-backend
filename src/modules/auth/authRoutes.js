const express = require("express");
const passport = require("passport");
const generateToken = require("../../utils/generateToken");
const router = express.Router();

const authController = require("./authController");

router.post("/signup", authController.signup);

router.post("/login", authController.login);

router.get("/google", passport.authenticate(
    "google",
    {
        scope: ["profile", "email"]
    }
)
);

router.get("/google/callback",
    passport.authenticate(
        "google",
        {
            session: false
        }
    ),
    async (req, res) => {
        const token= generateToken(req.user._id,req.user.role);
        res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
    }
);

module.exports = router;