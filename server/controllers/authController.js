const User = require("../models/user.js");
const jwt = require("jsonwebtoken");

// Helper: build a signed token
const generateToken = (id) => {
  return jwt.sign(
    { id },                                    // payload
    process.env.JWT_SECRET,                    // secret
    { expiresIn: process.env.JWT_EXPIRE || "1d" } // options (default 1 day)
  );
};

const hasJsonObjectBody = (body) => {
  return body !== null && typeof body === "object" && !Array.isArray(body);
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    if (!hasJsonObjectBody(req.body)) {
      return res.status(400).json({
        success: false,
        message: "Request body must be a JSON object"
      });
    }

    // "role" is deliberately NOT read from the request body.
    // Otherwise anyone could register as an admin by sending role: "admin".
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists"
      });
    }

    // pre('save') hook hashes the password automatically
    const user = await User.create({ name, email, password });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
        // password deliberately absent
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "test") {
      console.error("Register error:", error);
    }
    if (typeof next === "function") {
      return next(error);
    }

    return res.status(500).json({
      success: false,
      message: "Server error while registering user"
    });
  }
};

// @desc    Login a user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    if (!hasJsonObjectBody(req.body)) {
      return res.status(400).json({
        success: false,
        message: "Request body must be a JSON object"
      });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password"
      });
    }

    // Must explicitly select the password — it's select: false
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "test") {
      console.error("Login error:", error);
    }
    if (typeof next === "function") {
      return next(error);
    }

    return res.status(500).json({
      success: false,
      message: "Server error while logging in"
    });
  }
};

// @desc    Get the currently logged-in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    if (process.env.NODE_ENV !== "test") {
      console.error("GetMe error:", error);
    }
    if (typeof next === "function") {
      return next(error);
    }

    return res.status(500).json({
      success: false,
      message: "Server error while fetching user"
    });
  }
};

module.exports = { register, login, getMe };