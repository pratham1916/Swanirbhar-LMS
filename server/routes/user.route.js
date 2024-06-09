const express = require("express");
const { userModel } = require("../model/user.model");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Register For User
userRouter.post("/register", async (req, res) => {
    const { fullname, email, password } = req.body;
    try {
        const existingUserByEmail = await userModel.findOne({ email });

        if (existingUserByEmail) {
            return res.status(400).json({ message: "Email already exists, Please Login", status: "error" });
        }

        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                return res.status(400).json({ message: "Error hashing password", status: "error" });
            }
            const userDetails = new userModel({
                fullname, email, password: hash
            });
            await userDetails.save();
            return res.status(201).json({ status: "success", message: "Registration Successful",userDetails });
        });
    } catch (error) {
        res.status(400).json({ message: "Registration Failed", status: "error" });
    }
});

//Login For the User
userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email }).select('+password');
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);
                    res.status(200).json({ status: "success", message: "Login Successful", token, user });
                } else {
                    res.status(400).json({status: "error", message: "Wrong Email or Password"});
                }
            });
        } else {
            res.status(400).json({ status: "error", message: "Email does not exist"});
        }
    } catch (error) {
        res.status(400).json({status: "error", message: "Login Failed"});
    }
});

module.exports = {
    userRouter
};
