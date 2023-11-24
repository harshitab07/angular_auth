import express from "express";
import userModel from "./userModel.js";
import JWT from "jsonwebtoken";
import { comparePassword, hashPassword } from "./helper.js";

export const signupController = async (req, res) => {
  try {
    console.log('API call signupController', { body: req?.body });
    const { name, email, password, dob } = req.body;

    // validation
    if (!name || !email || !password || !dob) {
      return res.send({
        success: false,
        message: "User information is incomplete",
      });
    }

    // make sure its unique
    const user = await userModel.findOne({ email });
    if (user) {
      return res.send({
        success: false,
        message: "User already registered. Please LogIn",
      });
    }

    // save user
    const hashedPassword = await hashPassword(password);
    const newUser = await new userModel({
      name, email, password: hashedPassword, dob
    }).save();

    console.log('Success in API call signupController', { body: req?.body });
    return res.status(200).send({
      success: true,
      message: "User registered successfully!",
      newUser,
    });
  } catch (err) {
    console.log('Failure in call signupController', { body: req?.body });
    res.status(500).send({
      success: false,
      message: "Error in registration",
      error: err?.message || err
    });
  }
};

export const loginController = async (req, res) => {
  try {
    console.log('API call loginController', { body: req?.body });
    const { email, password } = req.body;

    if (!email || !password) {
      return res.send({
        success: false,
        message: "Invalid email or password",
      });
    }
    // check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.send({
        success: false,
        message: "User not found",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.send({
        success: false,
        message: "Invalid password",
      });
    }
    // create token
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    console.log('Success in API call loginController', { body: req?.body });
    return res.status(200).send({
      success: true,
      message: "Logged in successfully!",
      user: {
        name: user.name,
        email: user.email,
        dob: user.dob,
      },
      token,
    });
  } catch (err) {
    console.log('Failure in call loginController', { body: req?.body });
    res.status(500).send({
      success: false,
      message: "Error in login",
      error: err?.message || err
    });
  }
};

const router = express.Router();

router.post("/login", loginController);
router.post("/signup", signupController);

export default router;
