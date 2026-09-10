const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });
};

// @desc    Login or auto-register with just an email (no password required)
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, name } = req.body;

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email address" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      user = await User.create({
        email: normalizedEmail,
        name: name?.trim() || normalizedEmail.split("@")[0],
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        currency: user.currency,
        avatarColor: user.avatarColor,
        monthlyIncomeGoal: user.monthlyIncomeGoal,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, user: req.user });
  } catch (err) {
    next(err);
  }
};

// @desc    Update profile (name / monthly income goal)
// @route   PUT /api/auth/me
// @access  Private
const updateMe = async (req, res, next) => {
  try {
    const { name, monthlyIncomeGoal } = req.body;
    const user = await User.findById(req.user._id);

    if (name !== undefined) user.name = name.trim();
    if (monthlyIncomeGoal !== undefined) user.monthlyIncomeGoal = Number(monthlyIncomeGoal) || 0;

    await user.save();
    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

module.exports = { login, getMe, updateMe };
