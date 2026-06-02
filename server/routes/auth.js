import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    return res.json({
      success: true,
      message: "Login success",
      user,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });

  }

});
router.post("/signup", async (req, res) => {

  try {

    const { email, password, name, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      role,
    });

    res.json({
      message: "Account created",
      user,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Signup failed",
    });

  }

});

export default router;