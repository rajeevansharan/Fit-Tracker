import {
  asyncHandler,
  successResponse,
  errorResponse,
} from "../utils/helpers.js";
import { generateToken } from "../middleware/auth.js";
import User from "../models/User.js";

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return errorResponse(res, 400, "User already exists with this email");
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
  });

  // Generate token
  const token = generateToken(user._id);

  successResponse(
    res,
    201,
    {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    },
    "User registered successfully"
  );
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return errorResponse(res, 400, "Please provide email and password");
  }

  // Check for user (include password field)
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return errorResponse(res, 401, "Invalid credentials");
  }

  // Check if password matches
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return errorResponse(res, 401, "Invalid credentials");
  }

  // Check if account is active
  if (!user.isActive) {
    return errorResponse(res, 401, "Account is inactive");
  }

  // Generate token
  const token = generateToken(user._id);

  successResponse(
    res,
    200,
    {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        preferences: user.preferences,
        stats: user.stats,
      },
      token,
    },
    "Login successful"
  );
});

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  successResponse(res, 200, { user }, "User profile retrieved");
});

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/me
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    avatar: req.body.avatar,
    preferences: req.body.preferences,
  };

  // Remove undefined fields
  Object.keys(fieldsToUpdate).forEach(
    (key) => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
  );

  const user = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  successResponse(res, 200, { user }, "Profile updated successfully");
});

/**
 * @desc    Update password
 * @route   PUT /api/auth/password
 * @access  Private
 */
export const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return errorResponse(res, 400, "Please provide current and new password");
  }

  const user = await User.findById(req.user._id).select("+password");

  // Check current password
  const isMatch = await user.comparePassword(currentPassword);

  if (!isMatch) {
    return errorResponse(res, 401, "Current password is incorrect");
  }

  // Update password
  user.password = newPassword;
  await user.save();

  const token = generateToken(user._id);

  successResponse(res, 200, { token }, "Password updated successfully");
});
