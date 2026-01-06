import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await User.findOne({ email });

    if (existing)
      return res.status(401).json({ message: "User already Exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    return res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};




export const login = async (req, res) => {
  try {
    
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User doesn't exists" });

    const decoded = await bcrypt.compare(password, user.password);

    if (!decoded)
      return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7*24*60*60*1000
    })

    res.json({
      accessToken,
      user: {
        id: user._id,
        email: user.email
      }
    })

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken

  if(!refreshToken)
    return res.status(401).json({message: "No refresh token"})

  try {
    const payload = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )

    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const newAccessToken = generateAccessToken(user)

    res.json({accessToken: newAccessToken})
  } catch (error) {
    return res.status(403).json({message: "Invalid refresh token"})
  }
}


export const logout = async (req, res) => {
  res.clearCookie("refreshToken", {
  httpOnly: true,
  secure: false,
  sameSite: "lax"
});

  res.json({messgae: "Logged Out"})
}