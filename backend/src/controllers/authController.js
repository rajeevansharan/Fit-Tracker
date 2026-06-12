import {
  asyncHandler,
  successResponse,
  errorResponse,
} from "../utils/helpers.js";
import { generateToken } from "../middleware/auth.js";
import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) {
    return errorResponse(res, 400, "User already exists with this email");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // Generate token
  const token = generateToken(user.id);

  successResponse(
    res,
    201,
    {
      user: {
        id: user.id,
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

  // Check for user
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return errorResponse(res, 401, "Invalid credentials");
  }

  // Check if password matches
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return errorResponse(res, 401, "Invalid credentials");
  }

  // Check if account is active
  if (!user.isActive) {
    return errorResponse(res, 401, "Account is inactive");
  }

  // Generate token
  const token = generateToken(user.id);

  successResponse(
    res,
    200,
    {
      user: {
        id: user.id,
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
  const user = await prisma.user.findUnique({
    where: { id: req.user.id }
  });

  // Remove password from response
  if (user) {
    delete user.password;
  }

  successResponse(res, 200, { user }, "User profile retrieved");
});

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/me
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, avatar, preferences } = req.body;

  const dataToUpdate = {};
  if (name !== undefined) dataToUpdate.name = name;
  if (email !== undefined) dataToUpdate.email = email;
  if (avatar !== undefined) dataToUpdate.avatar = avatar;
  if (preferences !== undefined) dataToUpdate.preferences = preferences;

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: dataToUpdate,
  });

  delete user.password;

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

  const user = await prisma.user.findUnique({
    where: { id: req.user.id }
  });

  // Check current password
  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    return errorResponse(res, 401, "Current password is incorrect");
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Update password
  await prisma.user.update({
    where: { id: req.user.id },
    data: { password: hashedPassword },
  });

  const token = generateToken(user.id);

  successResponse(res, 200, { token }, "Password updated successfully");
});
