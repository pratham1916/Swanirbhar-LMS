const express = require("express");
const { userModel } = require("../model/user.model");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

userRouter.get("/", (req, res) => {
    res.send("Hiii");
});

userRouter.post("/register", async (req, res) => {
    const { fullname, email, password } = req.body;
    try {
        const existingUserByEmail = await userModel.findOne({ email });

        if (existingUserByEmail) {
            return res.status(400).json({ message: "Email already exists", status: "error" });
        }

        bcrypt.hash(password, 5, async (err, hash) => {
            if (err) {
                return res.status(400).json({ message: "Invalid Password", err });
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

userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email }).select('+password');
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);
                    res.status(200).json({ message: "Login Successful", token, user });
                } else {
                    res.status(400).json({ message: "Wrong Email or Password", status: "error" });
                }
            });
        } else {
            res.status(400).json({ message: "Email does not exist", status: 'error' });
        }
    } catch (error) {
        res.status(400).json({ message: "Login Failed", status: "error" });
    }
});

module.exports = {
    userRouter
};
